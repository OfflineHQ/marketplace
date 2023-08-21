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

// export const extractNftsCollectionInfoFromDb = async (
//   contractAddress: string
// ) => {
//   const res =
//     await adminSdk.GetEventNftCollectionByContractAddressWithMinimalEventPasses(
//       {
//         contractAddress,
//         stage: process.env.HYGRAPH_STAGE as Stage,
//       }
//     );
//   const eventPassNftCollection = res.eventNftCollection_by_pk;
//   if (!eventPassNftCollection) {
//     throw new Error('Event pass nft collection not found on database');
//   }
//   if (!eventPassNftCollection.event) {
//     throw new Error('Event pass nft collection has no event');
//   }
//   const eventId = eventPassNftCollection.event.id;
//   if (!eventPassNftCollection.event.organizer) {
//     throw new Error('Event pass nft collection has no organizer');
//   }
//   const organizerId = eventPassNftCollection.event.organizer.id;
//   if (
//     !eventPassNftCollection.event.eventPasses ||
//     !eventPassNftCollection.event.eventPasses.length
//   ) {
//     throw new Error('Event pass nft collection has no event passes');
//   }
//   const eventPassesIds = eventPassNftCollection.event.eventPasses.map(
//     (pass) => pass.id
//   );

//   return {
//     eventId,
//     organizerId,
//     chainId: eventPassNftCollection.chainId,
//     contractAddress: eventPassNftCollection.contractAddress,
//     eventPassesIds,
//   };
// };

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

export const getNftTransfersMetadata = async (
  nftTransfers: NftTransferWithoutMetadata[],
  contractAddress: string,
  chainId: string
  // nftCollectionsInfos: Awaited<
  //   ReturnType<typeof extractNftsCollectionInfoFromDb>
  // >
) => {
  // const { eventId, organizerId, eventPassesIds } = nftCollectionsInfos;
  const nftTransfersWithMetadata: NftTransfer[] = [];
  const res = await adminSdk.GetNftByCollectionAndTokenIds({
    contractAddress,
    chainId,
    tokenIds: nftTransfers.map((t) => t.tokenId),
  });
  const nfts = res.nftWithMetadata;
};

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

  // const nftCollectionsInfos = await extractNftsCollectionInfoFromDb(
  //   contractAddress
  // );
  // const nftTransfers = extractNftTransfersFromEvent(
  //   alchemyWebhookEvent,
  //   contractAddress,
  //   chainId
  // );
  // await getNftTransfersMetadata(nftTransfers, nftCollectionsInfos);

  // const nftCollectionsInfos = await extractNftsCollectionInfoFromDb(
  //   contractAddress
  // );
  // const nftTransfers = extractNftTransfersFromEvent(
  //   alchemyWebhookEvent,
  //   contractAddress,
  //   chainId
  // );
  // await getNftTransfersMetadata(nftTransfers, nftCollectionsInfos);

  return new Response(null, { status: 200 });
}
