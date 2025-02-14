import { Alchemy, Network, NftFilter } from 'alchemy-sdk';
import { getErrorMessage } from '@utils';

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

// Change made because the sdk Network enum is not accurate with what the NFT Activity value of network is https://docs.alchemy.com/reference/webhook-types
const networkToChainIdMap: { [key in Network | string]?: string } = {
  [Network.ETH_MAINNET]: '1',
  ETH_MAINNET: '1',
  [Network.ETH_GOERLI]: '5',
  ETH_GOERLI: '5',
  [Network.ETH_SEPOLIA]: '11155111',
  ETH_SEPOLIA: '11155111',
  [Network.OPT_MAINNET]: '69',
  OPT_MAINNET: '69',
  [Network.OPT_GOERLI]: '420',
  OPT_GOERLI: '420',
  [Network.ARB_MAINNET]: '42161',
  ARB_MAINNET: '42161',
  [Network.ARB_GOERLI]: '421613',
  ARB_GOERLI: '421613',
  [Network.MATIC_MAINNET]: '137',
  MATIC_MAINNET: '137',
  [Network.MATIC_MUMBAI]: '80001',
  MATIC_MUMBAI: '80001',
  [Network.ASTAR_MAINNET]: '592',
  ASTAR_MAINNET: '592',
  [Network.POLYGONZKEVM_MAINNET]: '1101',
  POLYGONZKEVM_MAINNET: '1101',
  [Network.POLYGONZKEVM_TESTNET]: '1442',
  POLYGONZKEVM_TESTNET: '1442',
  [Network.BASE_SEPOLIA]: '84532',
  BASE_SEPOLIA: '84532',
  [Network.MATIC_AMOY]: '80002',
  MATIC_AMOY: '80002',
};

// Helper function to fetch all pages concurrently
export async function fetchAllPages<T>(
  fetchPage: (
    pageKey?: string,
  ) => Promise<{ items: T[]; nextPageKey?: string }>,
  batchSize = 5, // Number of pages to fetch in parallel
  maxBatches = 20, // Maximum number of batches to avoid infinite loops
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
      'Reached maximum number of fetch batches. Possible infinite loop.',
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
      case '80002':
        network = Network.MATIC_AMOY;
        break;
      case '84532':
        network = Network.BASE_SEPOLIA;
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

  convertNetworkToChainId(network: Network | string): string {
    const chainId = networkToChainIdMap[network];
    if (!chainId) {
      throw new Error(`Unsupported network: ${network}`);
    }
    return chainId;
  }
  // NFT API

  async verifyNftOwnershipOnCollection(
    owner: string,
    contractAddress: string,
  ): Promise<boolean> {
    try {
      return await this.alchemy.nft.verifyNftOwnership(owner, contractAddress);
    } catch (error) {
      console.error(
        `Verifying NFT ownership failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }

  async verifyNftOwnershipOnCollections(
    owner: string,
    contractAddresses: string[],
  ): Promise<{
    [contractAddresses: string]: boolean;
  }> {
    try {
      return await this.alchemy.nft.verifyNftOwnership(
        owner,
        contractAddresses,
      );
    } catch (error) {
      console.error(
        `Verifying NFT ownership failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }

  async getNftsForOwner(
    ownerAddress: string,
    options: GetNftsForOwnerOptions,
  ): Promise<OwnedNftsResponse> {
    if (!options.contractAddresses || !options.contractAddresses.length) {
      throw new Error('At least one contract address must be provided.');
    }

    let OwnedNftsResponse: OwnedNftsResponse | undefined;
    const ownedNfts = await fetchAllPages<OwnedNft>(async (pageKey) => {
      const pageOptions = { ...options, pageKey };
      const response = await this.alchemy.nft.getNftsForOwner(
        ownerAddress,
        pageOptions,
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
    options?: GetTransfersForContractOptions,
  ): Promise<TransferredNft[]> {
    return fetchAllPages<TransferredNft>(async (pageKey?: string) => {
      const pageOptions = { ...options, pageKey };
      const response = await this.alchemy.nft.getTransfersForContract(
        contractAddress,
        pageOptions,
      );
      return {
        items: response.nfts,
        nextPageKey: response.pageKey,
      };
    });
  }

  async fetchAllNftsWithMetadata(
    contractAddress: string,
    options?: GetNftsForContractOptions,
  ): Promise<Nft[]> {
    const nfts: Nft[] = [];
    const nftsIterable = this.alchemy.nft.getNftsForContractIterator(
      contractAddress,
      options,
    ) as AsyncIterable<Nft>;

    for await (const nft of nftsIterable) {
      nfts.push(nft);
    }

    return nfts;
  }

  async fetchAllNftsWithoutMetadata(
    contractAddress: string,
    options?: GetBaseNftsForContractOptions,
  ): Promise<BaseNft[]> {
    const nfts: BaseNft[] = [];
    const nftsIterable = this.alchemy.nft.getNftsForContractIterator(
      contractAddress,
      options,
    ) as unknown as AsyncIterable<BaseNft>;

    for await (const nft of nftsIterable) {
      nfts.push(nft);
    }

    return nfts;
  }

  // Notify API

  async createNftActivityWebhook(
    webhookUrl: string,
    filters: NftWebhookParams['filters'],
  ): Promise<NftActivityWebhook> {
    const params = {
      network: this.network,
      filters,
    } satisfies NftWebhookParams;
    try {
      return await this.alchemy.notify.createWebhook(
        webhookUrl,
        WebhookType.NFT_ACTIVITY,
        params,
      );
    } catch (error) {
      console.error(
        `Creating NFT activity webhook failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }

  // https://docs.alchemy.com/reference/nft-metadata-updates-webhook
  async createNftMetadataUpdateWebhook(
    webhookUrl: string,
    filters: NftWebhookParams['filters'],
  ) {
    const params = {
      network: this.network,
      filters,
    } satisfies NftWebhookParams;
    try {
      return await this.alchemy.notify.createWebhook(
        webhookUrl,
        WebhookType.NFT_METADATA_UPDATE,
        params,
      );
    } catch (error) {
      console.error(
        `Creating NFT metadata update webhook failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }

  async addContractAddressToWebhook(webhookId: string, addresses: NftFilter[]) {
    try {
      return await this.alchemy.notify.updateWebhook(webhookId, {
        addFilters: addresses,
        removeFilters: [],
      });
    } catch (error) {
      console.error(
        `Updating NFT activity webhook failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await this.alchemy.notify.deleteWebhook(webhookId);
    } catch (error) {
      console.error(
        `Deleting NFT activity webhook failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }

  async getAllWebhooks(): Promise<GetAllWebhooksResponse> {
    try {
      return await this.alchemy.notify.getAllWebhooks();
    } catch (error) {
      console.error(
        `Fetching all webhooks failed: ${getErrorMessage(error)}`,
        error,
      );
      throw error;
    }
  }
}
