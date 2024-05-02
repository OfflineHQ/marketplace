'use server';

import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Stage } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';

export async function getLoyaltyCardOrganizer() {
  const user = await getCurrentUser();
  if (!user || !user.role?.organizerId) {
    throw new Error('User not found');
  } else {
    const data = await adminSdk.GetLoyaltyCardOrganizer({
      organizerId: user.role?.organizerId,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer?.loyaltyCard;
  }
}
