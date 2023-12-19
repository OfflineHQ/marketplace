'use server';

import env from '@env/server';
import { getEvent } from '@features/organizer/event-api';
import {
  createNftActivityWebhookForEvent,
  getAlchemyInfosFromEventId,
  updateNftActivityWebhook,
} from '@features/pass-api';
import { adminSdk } from '@gql/admin/api';
import type {
  CreateEventPassNftContractMutation,
  GetEventPassNftContractNftsQuery,
  GetEventPassNftContractNftsQueryVariables,
  InsertEventParametersMutation,
  InsertEventPassNftsMutation,
  UpdateNftsWithPackIdMutationVariables,
} from '@gql/admin/types';
import type {
  EventParameters_Insert_Input,
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
  PackNftContract_Insert_Input,
} from '@gql/shared/types';
import { defaultLocale } from '@next/i18n';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export async function createEventPassNftContract(
  object: EventPassNftContract_Insert_Input,
): Promise<
  CreateEventPassNftContractMutation['insert_eventPassNftContract_one']
> {
  const data = await adminSdk.CreateEventPassNftContract({ object });
  return data?.insert_eventPassNftContract_one;
}

export async function createPackNftContract(
  object: PackNftContract_Insert_Input,
) {
  const data = await adminSdk.CreatePackNftContract({ object });
  return data?.insert_packNftContract_one;
}

export async function updateNftsWithPackId(
  updates: UpdateNftsWithPackIdMutationVariables,
) {
  const data = await adminSdk.UpdateNftsWithPackId(updates);
  return data?.update_eventPassNft_many;
}

export async function createEventPassNfts(
  objects: EventPassNft_Insert_Input[],
): Promise<InsertEventPassNftsMutation['insert_eventPassNft']> {
  const data = await adminSdk.InsertEventPassNfts({ objects });
  return data?.insert_eventPassNft || null;
}

async function InsertEventParameters(
  objects: EventParameters_Insert_Input[],
): Promise<InsertEventParametersMutation['insert_eventParameters']> {
  const data = await adminSdk.InsertEventParameters({ objects });
  return data?.insert_eventParameters;
}

export async function getEventPassNftContractNfts(
  id: GetEventPassNftContractNftsQueryVariables,
): Promise<GetEventPassNftContractNftsQuery['eventPassNftContract'][0]> {
  const data = await adminSdk.GetEventPassNftContractNfts(id);
  return data?.eventPassNftContract[0];
}

export async function createEventParametersAndWebhook({
  eventId,
  nftCollectionAddresses,
  organizerId,
  eventSlug,
}) {
  const webhook = await getAlchemyInfosFromEventId({ eventId: eventId });

  if (webhook && webhook.activityWebhookId) {
    await updateNftActivityWebhook({
      webhookId: webhook.activityWebhookId,
      nftCollectionAddresses,
    });
  } else {
    const newWebhook = await createNftActivityWebhookForEvent({
      eventId,
      nftCollectionAddresses,
    });
    const event = await getEvent({
      eventSlug,
      locale: defaultLocale,
    });
    if (!event) throw new Error('Event not found');
    if (!event.eventDateLocations?.[0]) throw new Error('Event has no date');
    await InsertEventParameters([
      {
        activityWebhookId: newWebhook.id,
        organizerId,
        eventId,
        signingKey: newWebhook.signingKey,
        dateEnd: event.eventDateLocations[0].dateEnd, //TODO -> handle multiple dateLocations event ??
        dateStart: event.eventDateLocations[0].dateStart,
      },
    ]);
  }
}

export async function getUnopenedNftPackAmount(packId: string) {
  const packNftContract = (
    await adminSdk.GetPackNftContractFromPackId({
      packId: packId,
    })
  ).packNftContract;

  const nfts = packNftContract[0].eventPassNfts;
  const supply: Record<string, number> = {};

  for (const nft of nfts) {
    if (nft.currentOwnerAddress !== env.THIRDWEB_MASTER_ADDRESS) continue;
    if (supply[nft.eventPassId]) supply[nft.eventPassId] += 1;
    else supply[nft.eventPassId] = 1;
  }

  return supply;
}

export async function getPackSupply(contractAddress: string) {
  const sdk = new ThirdwebSDK(env.CHAIN);
  const pack = await sdk.getContract(contractAddress, 'pack');
  return pack.erc1155.totalSupply(0);
}
