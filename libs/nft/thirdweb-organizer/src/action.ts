'use server';

import env from '@env/server';
import {
  createNftActivityWebhookForEvent,
  getAlchemyInfosFromEventId,
  updateNftActivityWebhook,
} from '@features/pass-api';
import { adminSdk } from '@gql/admin/api';
import type {
  CreateEventPassNftContractMutation,
  GetEventPassNftContractNftsQueryVariables,
  UpdateNftsWithPackIdMutationVariables,
  Stage,
  Locale,
} from '@gql/admin/types';
import type {
  EventParameters_Insert_Input,
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
  PackNftContract_Insert_Input,
} from '@gql/shared/types';
import { defaultLocale } from '@next/i18n';
import { ContractType } from '@nft/types';
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
) {
  const data = await adminSdk.InsertEventPassNfts({ objects });
  return data?.insert_eventPassNft || null;
}

async function CreateEventParameters(object: EventParameters_Insert_Input) {
  const data = await adminSdk.CreateEventParameters({ object });
  return data?.insert_eventParameters_one;
}

export async function getEventPassNftContractNfts(
  id: GetEventPassNftContractNftsQueryVariables,
) {
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
    const data = await adminSdk.GetEvent({
      slug: eventSlug,
      locale: defaultLocale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    const event = data?.event;
    if (!event) throw new Error('Event not found');
    if (!event.eventDateLocations?.[0]) throw new Error('Event has no date');
    await CreateEventParameters({
      activityWebhookId: newWebhook.id,
      organizerId,
      eventId,
      signingKey: newWebhook.signingKey,
      dateEnd: event.eventDateLocations[0].dateEnd, //TODO -> handle multiple dateLocations event ??
      dateStart: event.eventDateLocations[0].dateStart,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // TODO -> handle timezone selection !
    });
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
  const pack = await sdk.getContract(contractAddress, ContractType.PACK);
  return pack.erc1155.totalSupply(0);
}
