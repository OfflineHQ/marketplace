import {
  isValidSignatureForAlchemyRequest,
  addAlchemyContextToRequest,
} from './utils';
import { adminSdk } from '@gql/admin/api';
import type { Stage, NftTransfer } from '@gql/shared/types';
import { WebhookType } from 'alchemy-sdk';
import type {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
  NftTransferWithoutMetadata,
  NftTransferNotCreated,
} from './types';
import { headers } from 'next/headers';

export const extractNftTransfersFromEvent = (
  alchemyWebhookEvent: AlchemyNFTActivityEvent
) => {
  const nftActivities = alchemyWebhookEvent.event.activity;
  const nftTransfers: NftTransferWithoutMetadata[] = [];
  if (!nftActivities?.length) {
    throw new Error('No nft activities found in event');
  }
  for (const activity of nftActivities) {
    const {
      fromAddress,
      toAddress,
      contractAddress,
      blockNumber,
      erc721TokenId,
      network,
    } = activity;
    const { transactionHash, removed } = activity.log;
    if (removed) {
      console.error(
        `NFT transfer: ${transactionHash} in ${network} for ${contractAddress} collection, fromAddress ${fromAddress} toAddress ${toAddress} with erc721TokenId ${erc721TokenId} was removed likely due to a reorg`
      );
    } else {
      nftTransfers.push({
        fromAddress,
        toAddress,
        contractAddress,
        blockNumber: blockNumber, // TODO: convert to bigint
        tokenId: erc721TokenId, // TODO: convert to bigint
        chainId: network, // TODO: convert to chainId hex string
        transactionHash,
      });
    }
  }
  return nftTransfers;
};

export const getEventPassNftTransfersMetadata = async (
  nftTransfers: NftTransferWithoutMetadata[],
  contractAddress: string,
  chainId: string
) => {
  const res = await adminSdk.GetEventPassNftByCollectionAndTokenIds({
    contractAddress,
    chainId,
    tokenIds: nftTransfers.map((t) => t.tokenId),
  });
  const eventPassNft = res.eventPassNft;

  return nftTransfers.reduce((acc, nft) => {
    const nftWithMetadata = eventPassNft.find((n) => n.tokenId === nft.tokenId);
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
};

export const upsertNftTransfers = async (
  nftTransfers: NftTransferNotCreated[]
) => {
  const res = await adminSdk.UpsertNftTransfer({
    objects: nftTransfers,
  });
  if (!res.insert_nftTransfer) {
    throw new Error('Failed to upsert NftTransfer');
  }
  return res.insert_nftTransfer.returning satisfies NftTransfer[];
};

export const UpdateEventPassNftFromNftTransfer = async (
  nftTransfers: NftTransfer[]
) => {
  const res = await adminSdk.UpdateEventPassNftFromNftTransfer({
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
};

// export const applyQrCodeBatchTransfer = async (
//   eventPassNfts:

export async function nftActivity(
  req: AlchemyRequest,
  contractAddress: string
) {
  const body = await req.text();
  const signature = headers().get('x-alchemy-signature') as string;
  addAlchemyContextToRequest(req, body, signature);
  if (
    !isValidSignatureForAlchemyRequest(
      req,
      process.env.ALCHEMY_SIGNING_KEY as string
    )
  ) {
    return new Response('Signature validation failed, unauthorized!', {
      status: 403,
    });
  }
  const alchemyWebhookEvent: AlchemyNFTActivityEvent = JSON.parse(body);

  if (alchemyWebhookEvent.type !== WebhookType.NFT_ACTIVITY) {
    throw new Error('Invalid webhook type. Expected NFT_ACTIVITY.');
  }
  const chainId = alchemyWebhookEvent.event.activity[0].network; // TODO: convert to chainId hex string

  const nftTransfersFromEvent =
    extractNftTransfersFromEvent(alchemyWebhookEvent);
  const NftTransfersNotCreated = await getEventPassNftTransfersMetadata(
    nftTransfersFromEvent,
    contractAddress,
    chainId
  );

  const nftTransfers = await upsertNftTransfers(NftTransfersNotCreated);
  await UpdateEventPassNftFromNftTransfer(nftTransfers);

  return new Response(null, { status: 200 });
}
