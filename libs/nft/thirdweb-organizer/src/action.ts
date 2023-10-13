'use server';

import {
  createNftActivityWebhookForEvent,
  getAlchemyInfosFromEventId,
  updateNftActivityWebhook,
} from '@features/pass-api';
import { adminSdk } from '@gql/admin/api';
import type {
  CreateEventPassNftContractMutation,
  InsertEventParametersMutation,
  InsertEventPassNftsMutation,
} from '@gql/admin/types';
import type {
  EventParameters_Insert_Input,
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
} from '@gql/shared/types';

export async function createEventPassNftContract(
  object: EventPassNftContract_Insert_Input,
): Promise<
  CreateEventPassNftContractMutation['insert_eventPassNftContract_one']
> {
  const data = await adminSdk.CreateEventPassNftContract({ object });
  return data?.insert_eventPassNftContract_one || null;
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

export async function createEventParametersAndWebhook({
  eventId,
  nftCollectionAddresses,
  organizerId,
}) {
  const webhook = await getAlchemyInfosFromEventId({ eventId: eventId });

  if (webhook.activityWebhookId) {
    await updateNftActivityWebhook({
      webhookId: webhook.activityWebhookId,
      nftCollectionAddresses,
    });
  } else {
    const newWebhook = await createNftActivityWebhookForEvent({
      eventId,
      nftCollectionAddresses,
    });
    await InsertEventParameters([
      {
        activityWebhookId: newWebhook.id,
        organizerId,
        eventId,
        signingKey: webhook.signingKey,
      },
    ]);
  }
}
