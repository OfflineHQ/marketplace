'use server';

import { EventSlugs } from '@features/organizer/event-types';
import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

const passeCache = new PassCache();

// React server components are async so you make database or API calls.
export interface DeleteEventPassesProps extends EventSlugs {
  eventPassIds: string[];
}

export async function deleteEventPasses({
  organizerSlug,
  eventSlug,
  eventPassIds,
}: DeleteEventPassesProps) {
  const user = await getCurrentUser();
  if (!user) {
    await passeCache.deletePassesCart({
      organizerSlug,
      eventSlug,
    });
  } else {
    await userSdk.DeleteEventPassPendingOrders({
      eventPassIds,
    });
  }
}
