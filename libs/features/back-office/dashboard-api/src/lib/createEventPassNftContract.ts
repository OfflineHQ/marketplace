import type { EventPassNftContract_Insert_Input } from '@gql/shared/types';
import { adminSdk } from '@gql/admin/api';
import type { CreateEventPassNftContractMutation } from '@gql/admin/types';

export const createEventPassNftContract = async (
  object: EventPassNftContract_Insert_Input
): Promise<
  CreateEventPassNftContractMutation['insert_eventPassNftContract_one']
> => {
  const data = await adminSdk.CreateEventPassNftContract({ object });
  return data?.insert_eventPassNftContract_one || null;
};
