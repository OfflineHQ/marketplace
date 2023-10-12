'use server';

import { adminSdk } from '@gql/admin/api';
import type {
  CreateEventPassNftContractMutation,
  InsertEventPassNftsMutation,
} from '@gql/admin/types';
import type {
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
} from '@gql/shared/types';

export async function createEventPassNftContract(
  object: EventPassNftContract_Insert_Input
): Promise<
  CreateEventPassNftContractMutation['insert_eventPassNftContract_one']
> {
  const data = await adminSdk.CreateEventPassNftContract({ object });
  return data?.insert_eventPassNftContract_one || null;
}

export async function createEventPassNfts(
  objects: EventPassNft_Insert_Input[]
): Promise<InsertEventPassNftsMutation['insert_eventPassNft']> {
  const data = await adminSdk.InsertEventPassNfts({ objects });
  return data?.insert_eventPassNft || null;
}
