import type { EventPassNft_Insert_Input } from '@gql/shared/types';
import { adminSdk } from '@gql/admin/api';
import type { InsertEventPassNftsMutation } from '@gql/admin/types';

export const createEventPassNfts = async (
  objects: EventPassNft_Insert_Input[],
): Promise<InsertEventPassNftsMutation['insert_eventPassNft']> => {
  const data = await adminSdk.InsertEventPassNfts({ objects });
  return data?.insert_eventPassNft || null;
};
