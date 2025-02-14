import { transferPassQrCodeBatch } from '@features/pass-api';
import { adminSdk } from '@gql/admin/api';
import type {
  EventPassNftAfterMutation,
  NftTransfer,
  NftTransferNotCreated,
  NftTransferWithoutMetadata,
} from '@nft/types';

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
    contractAddresses.forEach((address) => {
      if (address !== address.toLowerCase()) {
        console.error(`Contract address ${address} is not in lowercase`);
      }
    });
    const tokenIds = nftTransfers.map((t) => t.tokenId);
    const res = await this.adminSdk.GetEventPassNftByContractsAndTokenIds({
      contractAddresses,
      chainId,
      tokenIds,
    });
    if (!res?.eventPassNft) {
      throw new Error(
        `No NFTs found in database for contractAddresses ${contractAddresses}, chainId ${chainId} and tokenIds ${tokenIds}`,
      );
    }
    const eventPassNft = res.eventPassNft;

    return nftTransfers.reduce((acc, nft) => {
      const nftWithMetadata = eventPassNft.find(
        (n) => n.tokenId == nft.tokenId, // here avoid exact match because we want to compare bigint with number
      );
      if (!nftWithMetadata) {
        // TODO : Could be possible to create the NFT in Hasura if he's not found in the Database
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
