import { adminSdk } from '@gql/admin/api';
import type {
  NftTransfer,
  NftTransferWithoutMetadata,
  NftTransferNotCreated,
} from '@nft/types';
import { transferPassQrCodeBatch } from '@features/pass/server';

export class EventPassNftWrapper {
  private adminSdk: typeof adminSdk;
  constructor() {
    this.adminSdk = adminSdk;
  }
  async getEventPassNftTransfersMetadata(
    nftTransfers: NftTransferWithoutMetadata[],
    contractAddress: string,
    chainId: string
  ) {
    const res = await this.adminSdk.GetEventPassNftByCollectionAndTokenIds({
      contractAddress,
      chainId,
      tokenIds: nftTransfers.map((t) => t.tokenId),
    });
    const eventPassNft = res.eventPassNft;

    return nftTransfers.reduce((acc, nft) => {
      const nftWithMetadata = eventPassNft.find(
        (n) => n.tokenId === nft.tokenId
      );
      if (!nftWithMetadata) {
        console.error(
          `Metadata not found for this token ! Skipping execution for this transfer: ${nft.transactionHash} in ${nft.chainId} for ${nft.contractAddress} collection, fromAddress ${nft.fromAddress} toAddress ${nft.toAddress} with erc721TokenId ${nft.tokenId}. This is a critical error that should be investigated.`
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

    if (!res.update_eventPassNft_many) {
      throw new Error('Failed to update eventPassNft');
    }

    return res.update_eventPassNft_many
      .map((nftRes) => {
        if (!nftRes?.returning || !nftRes.returning?.length) {
          console.error(
            'No returning data for an update on eventPassNft, this is likely an error'
          );
          return null;
        }
        return nftRes.returning[0];
      })
      .filter((item) => item !== null);
  }
  // we handle the transfer of the QR code from the old owner to the new owner for each nft that has been revealed
  async applyQrCodeBatchTransferForNewOwner(
    eventPassNfts: Awaited<
      ReturnType<typeof this.updateEventPassNftFromNftTransfer>
    >
  ) {
    const nftFileTransfers: typeof eventPassNfts = [];
    for (const eventPassNft of eventPassNfts) {
      if (eventPassNft.isRevealed) {
        if (!eventPassNft.lastNftTransfer)
          console.error(
            `lastNftTransfer is null for revealed eventPassNft with id ${eventPassNft.id}. This is likely an error`
          );
        nftFileTransfers.push(eventPassNft);
      }
    }
    if (nftFileTransfers.length === 0) return;
    const transferInputs = nftFileTransfers.map((nft) => {
      return {
        formerOwnerAddress: nft.lastNftTransfer.fromAddress,
        eventPassNft: nft,
      };
    });
    await transferPassQrCodeBatch(transferInputs);
  }
}
