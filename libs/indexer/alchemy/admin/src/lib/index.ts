import { Alchemy, Network, NftFilter } from 'alchemy-sdk';

import env from '@env/server';
import type {
  BaseNft,
  GetAllWebhooksResponse,
  GetBaseNftsForContractOptions,
  GetNftsForContractOptions,
  Nft,
  NftActivityWebhook,
  NftWebhookParams,
  OwnedNft,
  OwnedNftsResponse,
  TransferredNft,
  GetNftsForOwnerOptions as _GetNftsForOwnerOptions,
  GetTransfersForContractOptions as _GetTransfersForContractOptions,
} from '@indexer/alchemy/types';
import { WebhookType } from '@indexer/alchemy/types';

interface GetNftsForOwnerOptions
  extends Omit<_GetNftsForOwnerOptions, 'contractAddresses'> {
  contractAddresses?: string[];
}

interface GetTransfersForContractOptions
  extends Omit<
    _GetTransfersForContractOptions,
    'fromBlock' | 'toBlock' | 'pageKey'
  > {
  fromBlock: _GetTransfersForContractOptions['fromBlock'];
  toBlock: _GetTransfersForContractOptions['toBlock'];
}

// Helper function to fetch all pages concurrently
export async function fetchAllPages<T>(
  fetchPage: (
    pageKey?: string
  ) => Promise<{ items: T[]; nextPageKey?: string }>,
  batchSize = 5, // Number of pages to fetch in parallel
  maxBatches = 20 // Maximum number of batches to avoid infinite loops
): Promise<T[]> {
  const allItems: T[] = [];

  const initialData = await fetchPage();
  allItems.push(...initialData.items);

  let nextPageKey = initialData.nextPageKey;
  let batchCount = 0;

  while (nextPageKey && batchCount < maxBatches) {
    const batchPromises: Promise<{ items: T[]; nextPageKey?: string }>[] = [];

    for (let i = 0; i < batchSize && nextPageKey; i++) {
      batchPromises.push(fetchPage(nextPageKey));
      nextPageKey = undefined; // Clear the nextPageKey to avoid adding more promises in this batch than intended
    }

    const results = await Promise.allSettled(batchPromises);

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value.items);
        nextPageKey = result.value.nextPageKey;
      } else {
        // Handle rejected promise if needed
        console.error(result.reason);
      }
    }

    batchCount++;
  }

  if (batchCount === maxBatches) {
    throw new Error(
      'Reached maximum number of fetch batches. Possible infinite loop.'
    );
  }

  return allItems;
}

export class AlchemyWrapper {
  private alchemy: Alchemy;
  network: Network;

  constructor() {
    const apiKey = env.ALCHEMY_API_KEY;
    let network: Network;
    switch (env.CHAIN) {
      case '5':
        network = Network.ETH_GOERLI;
        break;
      case '11155111':
        network = Network.ETH_SEPOLIA;
        break;
      case '137':
        network = Network.MATIC_MAINNET;
        break;
      case '80001':
        network = Network.MATIC_MUMBAI;
        break;
      default:
        throw new Error(`Unsupported network: ${env.CHAIN}`);
    }
    this.network = network;
    const authToken = env.ALCHEMY_AUTH_TOKEN;
    this.alchemy = new Alchemy({
      apiKey,
      network,
      authToken,
    });
  }

  convertNetworkToChainId(network: Network): string {
    switch (network) {
      case Network.ETH_MAINNET:
        return '1';
      case Network.ETH_GOERLI:
        return '5';
      case Network.ETH_SEPOLIA:
        return '11155111';
      case Network.OPT_MAINNET:
        return '69';
      case Network.OPT_GOERLI:
        return '420';
      case Network.ARB_MAINNET:
        return '42161';
      case Network.ARB_GOERLI:
        return '421613';
      case Network.MATIC_MAINNET:
        return '137';
      case Network.MATIC_MUMBAI:
        return '80001';
      case Network.ASTAR_MAINNET:
        return '592';
      case Network.POLYGONZKEVM_MAINNET:
        return '1101';
      case Network.POLYGONZKEVM_TESTNET:
        return '1442';
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }
  // NFT API

  async verifyNftOwnershipOnCollection(
    owner: string,
    contractAddress: string
  ): Promise<boolean> {
    try {
      return await this.alchemy.nft.verifyNftOwnership(owner, contractAddress);
    } catch (error) {
      console.error(`Verifying NFT ownership failed: ${error.message}`, error);
      throw error;
    }
  }

  async verifyNftOwnershipOnCollections(
    owner: string,
    contractAddresses: string[]
  ): Promise<{
    [contractAddresses: string]: boolean;
  }> {
    try {
      return await this.alchemy.nft.verifyNftOwnership(
        owner,
        contractAddresses
      );
    } catch (error) {
      console.error(`Verifying NFT ownership failed: ${error.message}`, error);
      throw error;
    }
  }

  async getNftsForOwner(
    ownerAddress: string,
    options: GetNftsForOwnerOptions
  ): Promise<OwnedNftsResponse> {
    if (!options.contractAddresses || !options.contractAddresses.length) {
      throw new Error('At least one contract address must be provided.');
    }

    let OwnedNftsResponse: OwnedNftsResponse | undefined;
    const ownedNfts = await fetchAllPages<OwnedNft>(async (pageKey) => {
      const pageOptions = { ...options, pageKey };
      const response = await this.alchemy.nft.getNftsForOwner(
        ownerAddress,
        pageOptions
      );
      // here we set the OwnedNftsResponse to the first response we get back because successive page will have the same result except for the items in `ownedNfts`
      if (!OwnedNftsResponse) {
        OwnedNftsResponse = response;
      }
      return {
        items: response.ownedNfts,
        nextPageKey: response.pageKey,
      };
    });

    if (!OwnedNftsResponse) {
      throw new Error('Failed to fetch NFTs for owner.');
    }

    return {
      ...OwnedNftsResponse,
      ownedNfts,
    };
  }

  async getTransfersForContract(
    contractAddress: string,
    options?: GetTransfersForContractOptions
  ): Promise<TransferredNft[]> {
    return fetchAllPages<TransferredNft>(async (pageKey?: string) => {
      const pageOptions = { ...options, pageKey };
      const response = await this.alchemy.nft.getTransfersForContract(
        contractAddress,
        pageOptions
      );
      return {
        items: response.nfts,
        nextPageKey: response.pageKey,
      };
    });
  }

  async fetchAllNftsWithMetadata(
    contractAddress: string,
    options?: GetNftsForContractOptions
  ): Promise<Nft[]> {
    const nfts: Nft[] = [];
    const nftsIterable = this.alchemy.nft.getNftsForContractIterator(
      contractAddress,
      options
    ) as AsyncIterable<Nft>;

    for await (const nft of nftsIterable) {
      nfts.push(nft);
    }

    return nfts;
  }

  async fetchAllNftsWithoutMetadata(
    contractAddress: string,
    options?: GetBaseNftsForContractOptions
  ): Promise<BaseNft[]> {
    const nfts: BaseNft[] = [];
    const nftsIterable = this.alchemy.nft.getNftsForContractIterator(
      contractAddress,
      options
    ) as unknown as AsyncIterable<BaseNft>;

    for await (const nft of nftsIterable) {
      nfts.push(nft);
    }

    return nfts;
  }

  // Notify API

  async createNftActivityWebhook(
    webhookUrl: string,
    filters: NftWebhookParams['filters']
  ): Promise<NftActivityWebhook> {
    const params = {
      network: this.network,
      filters,
    } satisfies NftWebhookParams;
    try {
      return await this.alchemy.notify.createWebhook(
        webhookUrl,
        WebhookType.NFT_ACTIVITY,
        params
      );
    } catch (error) {
      console.error(
        `Creating NFT activity webhook failed: ${error.message}`,
        error
      );
      throw error;
    }
  }

  async addAddressNftActivityWebhook(
    webhookId: string,
    addresses: NftFilter[]
  ) {
    try {
      return await this.alchemy.notify.updateWebhook(webhookId, {
        addFilters: addresses,
        removeFilters: [],
      });
    } catch (error) {
      console.error(
        `Updating NFT activity webhook failed: ${error.message}`,
        error
      );
      throw error;
    }
  }

  async deleteNftActivityWebhook(webhookId: string): Promise<void> {
    try {
      await this.alchemy.notify.deleteWebhook(webhookId);
    } catch (error) {
      console.error(
        `Deleting NFT activity webhook failed: ${error.message}`,
        error
      );
      throw error;
    }
  }

  async getAllWebhooks(): Promise<GetAllWebhooksResponse> {
    try {
      return await this.alchemy.notify.getAllWebhooks();
    } catch (error) {
      console.error(`Fetching all webhooks failed: ${error.message}`, error);
      throw error;
    }
  }
}
