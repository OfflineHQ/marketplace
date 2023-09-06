'use server';

import { adminSdk } from '@gql/admin/api';
import { Stage } from '@gql/shared/types';

export async function GetOrganizerSlug(id: string) {
  'use server';
  const data = await adminSdk.GetOrganizerFromId({
    id: id,
    stage: process.env.HYGRAPH_STAGE as Stage,
  });
  return data?.organizer?.slug;
}
