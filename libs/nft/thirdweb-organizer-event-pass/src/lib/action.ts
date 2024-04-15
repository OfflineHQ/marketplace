'use server';

import env from '@env/server';
import {
  createWebhooksForEvent,
  getAlchemyInfosFromEventId,
  updateWebhooksForEvent,
} from '@features/back-office/events-api';
import { adminSdk } from '@gql/admin/api';
import { GetEventPassNftContractNftsLazyMintedQueryVariables } from '@gql/admin/types';
import type {
  EventParameters_Insert_Input,
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
} from '@gql/shared/types';
import { Locale, Stage } from '@gql/shared/types';
import { defaultLocale } from '@next/i18n';
import { getErrorMessage } from '@utils';
import { NftFilter } from 'alchemy-sdk';

export async function createEventPassNftContract(
  object: EventPassNftContract_Insert_Input,
) {
  const data = await adminSdk.CreateEventPassNftContract({ object });
  return data?.insert_eventPassNftContract_one;
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

export async function getEventPassNftContractNftsLazyMinted(
  id: GetEventPassNftContractNftsLazyMintedQueryVariables,
) {
  const data = await adminSdk.GetEventPassNftContractNftsLazyMinted(id);
  return data?.eventPassNftContract[0];
}

interface CreateEventParametersAndWebhookProps {
  eventId: string;
  nftCollectionAddresses: NftFilter[];
  organizerId: string;
  eventSlug: string;
}

export async function createEventParametersAndWebhook({
  eventId,
  nftCollectionAddresses,
  organizerId,
  eventSlug,
}: CreateEventParametersAndWebhookProps) {
  const eventParameters = await getAlchemyInfosFromEventId({
    eventId: eventId,
  });

  if (eventParameters) {
    await updateWebhooksForEvent({
      activityWebhookId: eventParameters.activityWebhookId || undefined,
      metadataUpdateWebhookId:
        eventParameters.metadataUpdateWebhookId || undefined,
      nftCollectionAddresses,
    });
  } else {
    const data = await adminSdk.GetEvent({
      slug: eventSlug,
      locale: defaultLocale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    const event = data?.event;
    if (!event) throw new Error('Event not found');
    if (!event.eventDateLocations?.[0]) throw new Error('Event has no date');
    console.log('event.eventDateLocations[0]', event.eventDateLocations[0]);
    const { activityWebhook, metadataUpdateWebhook } =
      await createWebhooksForEvent({
        eventId,
        nftCollectionAddresses,
        createActivityWebhook: true,
        createMetadataUpdateWebhook: false, // TODO -> handle metadata update webhook (especially for delayed reveal)
      });
    await CreateEventParameters({
      activityWebhookId: activityWebhook?.id,
      metadataUpdateWebhookId: metadataUpdateWebhook?.id || undefined,
      activityWebhookSigningKey: activityWebhook?.signingKey,
      metadataUpdateWebhookSigningKey:
        metadataUpdateWebhook?.signingKey || undefined,
      organizerId,
      eventId,
      dateEnd: event.eventDateLocations[0].dateEnd, //TODO -> handle multiple dateLocations event ??
      dateStart: event.eventDateLocations[0].dateStart,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // TODO -> handle timezone selection !
    });
  }
}

export async function getEventPassDelayedRevealPassword(
  contractAddress: string,
) {
  const res = await adminSdk.GetEventPassNftContractDelayedRevealPassword({
    contractAddress,
  });
  return res?.eventPassNftContract?.[0];
}

export async function saveRevealIntoDb(contractAddress: string) {
  try {
    await adminSdk.UpdateEventPassNftContractDelayedRevealStatus({
      contractAddress,
    });

    return adminSdk.GetListCurrentOwnerAddressForContractAddress({
      contractAddress,
    });
  } catch (e) {
    throw new Error(
      `Error saving the reveal status into the database for address ${contractAddress} : ${getErrorMessage(e)}`,
    );
  }
}
