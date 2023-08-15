import {
  isValidSignatureForAlchemyRequest,
  addAlchemyContextToRequest,
} from './utils';
import { adminSdk } from '@gql/admin/api';
import type { Stage } from '@gql/shared/types';
import { WebhookType } from 'alchemy-sdk';
import type {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
  NftTransfer,
} from './types';
import { headers } from 'next/headers';

const extractNftsCollectionInfoFromDb = async (contractAddress: string) => {
  const res =
    await adminSdk.GetEventNftCollectionByContractAddressWithMinimalEventPasses(
      {
        contractAddress,
        stage: process.env.HYGRAPH_STAGE as Stage,
      }
    );
  const eventPassNftCollection = res.eventNftCollection_by_pk;
  if (!eventPassNftCollection) {
    throw new Error('Event pass nft collection not found on database');
  }
  if (!eventPassNftCollection.event) {
    throw new Error('Event pass nft collection has no event');
  }
  const eventId = eventPassNftCollection.event.id;
  if (!eventPassNftCollection.event.organizer) {
    throw new Error('Event pass nft collection has no organizer');
  }
  const organizerId = eventPassNftCollection.event.organizer.id;
  if (
    !eventPassNftCollection.event.eventPasses ||
    !eventPassNftCollection.event.eventPasses.length
  ) {
    throw new Error('Event pass nft collection has no event passes');
  }
  const eventPassesIds = eventPassNftCollection.event.eventPasses.map(
    (pass) => pass.id
  );
  return {
    eventId,
    organizerId,
    eventPassesIds,
  };
};

const extractNftTransfersFromEvent = (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
  nftCollectionsInfos: Awaited<
    ReturnType<typeof extractNftsCollectionInfoFromDb>
  >
) => {
  const { eventId, organizerId, eventPassesIds } = nftCollectionsInfos;
  const nftActivities = alchemyWebhookEvent.event.activity;
  let nftTransfers: NftTransfer[];
  // const nfts = alchemyWebhookEvent.data.nfts;
  // const nftsToInsert = nfts.map((nft) => ({
  //   ...nft,
  //   eventId,
  //   organizerId,
  //   eventPassesIds,
  //   contractAddress: nft.contract.address,
  //   tokenId: nft.token_id,
  // }));
  // return nftsToInsert;
};

export async function nftActivity(
  req: AlchemyRequest,
  contractAddress: string
) {
  const body = await req.text();
  const signature = headers().get('x-alchemy-signature') as string;
  addAlchemyContextToRequest(req, body, signature);
  if (
    !isValidSignatureForAlchemyRequest(req, process.env.ALCHEMY_SIGNING_KEY)
  ) {
    return new Response('Signature validation failed, unauthorized!', {
      status: 403,
    });
  }
  const alchemyWebhookEvent: AlchemyNFTActivityEvent = JSON.parse(body);

  if (alchemyWebhookEvent.type !== WebhookType.NFT_ACTIVITY) {
    throw new Error('Invalid webhook type. Expected NFT_ACTIVITY.');
  }

  const nftCollectionsInfos = await extractNftsCollectionInfoFromDb(
    contractAddress
  );

  return new Response(null, { status: 200 });
}
