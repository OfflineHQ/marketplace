import type { EventNftCollection_Insert_Input } from '@gql/shared/types';
import { adminSdk } from '@gql/admin/api';
import type { CreateEventNftCollectionMutation } from '@gql/admin/types';

export const createEventNftCollection = async (
  object: EventNftCollection_Insert_Input
): Promise<
  CreateEventNftCollectionMutation['insert_eventNftCollection_one']
> => {
  const data = await adminSdk.CreateEventNftCollection({ object });
  return data?.insert_eventNftCollection_one || null;
};
