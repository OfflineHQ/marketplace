import env from '@env/server';
import { transferPassQrCodeBatch } from '@features/pass-api';
import { adminSdk } from '@gql/admin/api';
import {
  NftTransfer_Insert_Input,
  PackNftSupply_Updates,
} from '@gql/shared/types';
import { Activity } from '@indexer/alchemy/types';
import {
  ContractType,
  RewardUnitsDistributed,
  ThirdwebEventData,
  type EventPassNftAfterMutation,
  type NftTransfer,
  type NftTransferNotCreated,
  type NftTransferWithoutMetadata,
} from '@nft/types';
import { ThirdwebSDK, type ContractEvent } from '@thirdweb-dev/sdk';

type HandleBundlesProps = {
  numOfPacksOpened: number;
  bundleSize: number;
  nftToBundle: string[];
  opener: string;
  contractAddress: string;
};

export class EventPassNftWrapper {
  private adminSdk: typeof adminSdk;
  constructor() {
    this.adminSdk = adminSdk;
  }
  async getEventPassNftTransfersMetadata(
    nftTransfers: NftTransferWithoutMetadata[],
    chainId: string,
  ) {
    const contractAddresses: string[] = [
      ...new Set(nftTransfers.map((transfer) => transfer.contractAddress)),
    ];
    const res = await this.adminSdk.GetEventPassNftByContractsAndTokenIds({
      contractAddresses,
      chainId,
      tokenIds: nftTransfers.map((t) => t.tokenId),
    });
    const eventPassNft = res.eventPassNft;

    return nftTransfers.reduce((acc, nft) => {
      const nftWithMetadata = eventPassNft.find(
        (n) => n.tokenId == nft.tokenId, // here avoid exact match because we want to compare bigint with number
      );
      if (!nftWithMetadata) {
        console.error(
          `Metadata not found for this token ! Skipping execution for this transfer: ${nft.transactionHash} in ${nft.chainId} for ${nft.contractAddress} collection, fromAddress ${nft.fromAddress} toAddress ${nft.toAddress} with erc721TokenId ${nft.tokenId}. This is a critical error that should be investigated.`,
        );
        return acc; // Skip this item and continue with the next one
      }
      const { eventId, eventPassId, organizerId } = nftWithMetadata;
      return [
        ...acc,
        {
          ...nft,
          eventId,
          eventPassId,
          organizerId,
        } satisfies NftTransferNotCreated,
      ];
    }, [] as NftTransferNotCreated[]);
  }

  async upsertNftTransfers(nftTransfers: NftTransferNotCreated[]) {
    const res = await this.adminSdk.UpsertNftTransfer({
      objects: nftTransfers,
    });
    if (!res.insert_nftTransfer) {
      throw new Error('Failed to upsert NftTransfer');
    }
    return res.insert_nftTransfer.returning satisfies NftTransfer[];
  }

  async updateEventPassNftFromNftTransfer(nftTransfers: NftTransfer[]) {
    const res = await this.adminSdk.UpdateEventPassNftFromNftTransfer({
      updates: nftTransfers.map((transfer) => {
        const { chainId, contractAddress, tokenId, toAddress, id } = transfer;
        return {
          where: {
            contractAddress: { _eq: contractAddress },
            tokenId: { _eq: tokenId },
            chainId: { _eq: chainId },
          },
          _set: {
            currentOwnerAddress: toAddress,
            lastNftTransferId: id,
          },
        };
      }),
    });

    let update_eventPassNft_many: typeof res.update_eventPassNft_many = [];
    if (Array.isArray(res.update_eventPassNft_many)) {
      update_eventPassNft_many = res.update_eventPassNft_many;
    } else if (res.update_eventPassNft_many) {
      update_eventPassNft_many = [res.update_eventPassNft_many];
    } else {
      throw new Error('Failed to update eventPassNft');
    }
    return update_eventPassNft_many.reduce((result, nftRes, index) => {
      if (!nftRes?.returning || !nftRes.returning?.length) {
        console.error(
          `No returning data for an update on eventPassNft, this is likely an error or a NFT that is missing. Please investigate ! Failed transfer:`,
          nftTransfers[index],
        );
        return result;
      }
      return [...result, nftRes.returning[0]];
    }, [] as EventPassNftAfterMutation[]);
  }
  // we handle the transfer of the QR code from the old owner to the new owner for each nft that has been revealed
  async applyQrCodeBatchTransferForNewOwner(
    eventPassNfts: EventPassNftAfterMutation[],
  ) {
    const nftFileTransfers: Parameters<typeof transferPassQrCodeBatch>[0] = [];
    for (const eventPassNft of eventPassNfts) {
      if (eventPassNft.isRevealed) {
        if (!eventPassNft.lastNftTransfer)
          console.error(
            `lastNftTransfer is null for revealed eventPassNft with id ${eventPassNft.id}. This is likely an error`,
          );
        else
          nftFileTransfers.push({
            formerOwnerAddress: eventPassNft.lastNftTransfer.fromAddress,
            eventPassNft,
          });
      }
    }
    if (nftFileTransfers.length === 0) return;
    await transferPassQrCodeBatch(nftFileTransfers);
  }
}

export class PackNftWrapper {
  private adminSdk: typeof adminSdk;
  private thirdwebSDK: ThirdwebSDK;

  constructor(thirdwebSDKInstance: ThirdwebSDK) {
    this.adminSdk = adminSdk;
    this.thirdwebSDK = thirdwebSDKInstance;
  }

  async getCurrentOwnerAddressByContractAndTokenId(
    contractAddress: string,
    tokenId: string,
  ) {
    try {
      const response =
        await this.adminSdk.GetCurrentOwnerAddressByContractAndTokenId({
          contractAddress,
          tokenId: BigInt(tokenId),
        });
      return response.eventPassNft[0];
    } catch (error) {
      console.error(
        `Error getting current owner address by contract and token id: ${error}`,
      );
      throw new Error(
        'Failed to get current owner address by contract and token id',
      );
    }
  }

  async getNftToBundle(
    rewardUnitsDistributed: RewardUnitsDistributed,
    opener: string,
  ) {
    try {
      const nftToBundle = [];
      for (const reward of rewardUnitsDistributed) {
        const owner = await this.getCurrentOwnerAddressByContractAndTokenId(
          reward.assetContract,
          reward.tokenId,
        );
        if (owner.currentOwnerAddress !== opener) {
          nftToBundle.push(owner.id);
        }
      }
      return nftToBundle;
    } catch (error) {
      console.error(
        `Error getting NFT to bundle for opener ${opener}: ${error}`,
      );
      throw new Error('Failed to get NFT to bundle');
    }
  }

  async handleBundles({
    numOfPacksOpened,
    bundleSize,
    nftToBundle,
    opener,
    contractAddress,
  }: HandleBundlesProps) {
    try {
      const bundles = [];
      for (let i = 0; i < numOfPacksOpened; i++) {
        const start = i * bundleSize;
        const end = start + bundleSize;
        const bundle = nftToBundle.slice(start, end);
        const pack =
          await this.adminSdk.GetPackNftSupplyWithNullNftsFromCurrentOwnerAddress(
            {
              currentOwnerAddress: opener,
              contractAddress,
            },
          );
        bundles.push({
          id: pack.packNftSupply[0].id,
          newData: {
            eventPassNfts: bundle,
          },
        });
      }
      return bundles;
    } catch (error) {
      console.error(
        `Error handling bundles for opener ${opener} and contract ${contractAddress}: ${error}`,
      );
      throw new Error('Failed to handle bundles');
    }
  }

  async handleEvent(
    event: ContractEvent,
    numOfPacksOpened: number,
    contractAddress: string,
  ) {
    const { opener, rewardUnitsDistributed } = event.data as ThirdwebEventData;
    const nftToBundle = await this.getNftToBundle(
      rewardUnitsDistributed,
      opener,
    );
    const bundleSize = nftToBundle.length / numOfPacksOpened;
    return this.handleBundles({
      numOfPacksOpened,
      bundleSize,
      nftToBundle,
      opener,
      contractAddress,
    });
  }

  async handlePackOpenedEvents(
    contractAddress: string,
    blockNumber: string,
    transactionHash: string,
  ) {
    let events: ContractEvent[];
    try {
      const pack = await this.thirdwebSDK.getContract(
        contractAddress,
        ContractType.PACK,
      );
      events = await pack.events.getEvents('PackOpened', {
        fromBlock: blockNumber,
        toBlock: 'latest',
        order: 'desc',
      });
    } catch (error) {
      throw new Error(`Failed to get contract or events: ${error.message}`);
    }

    const packUpdates = [];
    for (const event of events) {
      if (
        event.transaction.blockNumber !== Number(blockNumber) ||
        event.transaction.transactionHash !== transactionHash
      )
        continue;
      const numOfPacksOpened = Number(event.data.numOfPacksOpened);
      packUpdates.push(
        await this.handleEvent(event, numOfPacksOpened, contractAddress),
      );
    }
    return packUpdates;
  }

  async transferPackNftSupply(
    amount: number,
    nftTransferData: NftTransfer_Insert_Input,
  ) {
    const packUpdates: PackNftSupply_Updates[] = [];
    try {
      for (let i = 0; i < amount; i++) {
        const pack = (
          await this.adminSdk.GetPackNftSupplyWithNullNftsFromCurrentOwnerAddress(
            {
              currentOwnerAddress: nftTransferData.fromAddress,
              contractAddress: nftTransferData.contractAddress,
            },
          )
        ).packNftSupply[0];
        const transfer = (
          await adminSdk.UpsertNftTransfer({
            objects: {
              ...nftTransferData,
              organizerId: pack.organizerId,
            },
          })
        ).insert_nftTransfer;
        packUpdates.push({
          where: {
            id: { _eq: pack.id },
          },
          _set: {
            currentOwnerAddress: nftTransferData.toAddress,
            lastNftTransferId: transfer.returning[0].id,
          },
        });
      }
    } catch (error) {
      throw new Error(
        `Failed to transfer Event Pass Pack from ${nftTransferData.fromAddress} to ${nftTransferData.toAddress}: ${error.message}`,
      );
    }
    return packUpdates;
  }

  async handleErc1155Activity(activity: Activity, transactionHash: string) {
    const { toAddress, fromAddress, contractAddress, blockNumber } = activity;

    if (toAddress === '0x0000000000000000000000000000000000000000') {
      return this.handlePackOpenedEvents(
        contractAddress,
        blockNumber,
        transactionHash,
      );
    } else {
      const erc1155Metadata = activity.erc1155Metadata;
      const amount = Number(erc1155Metadata[0].value);
      return this.transferPackNftSupply(amount, {
        toAddress,
        fromAddress,
        contractAddress,
        transactionHash,
        chainId: env.CHAIN,
        blockNumber: Number(blockNumber),
        tokenId: 0,
      });
    }
  }
}
