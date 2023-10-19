'use server';

import { EventSlugs } from '@features/organizer/event-types';
import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

const passeCache = new PassCache();

// React server components are async so you make database or API calls.
export interface UpdateEventPassCartProps extends EventSlugs {
  eventPassId: string;
  quantity: number;
}

export async function updateEventPassCart({
  organizerSlug,
  eventSlug,
  eventPassId,
  quantity,
}: UpdateEventPassCartProps) {
  const user = await getCurrentUser();
  if (!user) {
    if (quantity === 0) {
      await passeCache.deletePassCart({
        organizerSlug,
        eventSlug,
        eventPassId,
      });
    } else
      await passeCache.updatePassCart({
        organizerSlug,
        eventSlug,
        pass: { eventPassId, quantity },
      });
  } else {
    if (quantity === 0) {
      await userSdk.DeleteEventPassPendingOrders({
        eventPassIds: [eventPassId],
      });
    } else
      await userSdk.UpsertEventPassPendingOrder({
        object: {
          eventPassId,
          quantity,
        },
      });
  }
  // give a 404 error, server action bug ?
  // revalidateTag(`getEventPassOrderSum-${eventPassId}`);
  // revalidateTag(`getEventPassCart-${eventPassId}`);
  // revalidateTag('getEventPassesCart');
}
