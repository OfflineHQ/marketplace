'use server';

import { EventSlugs } from '@features/organizer/event-types';
import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { isJestRunning } from '@utils';
import { revalidateTag } from 'next/cache';

const passCache = new PassCache();

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
      await passCache.deletePassCart({
        organizerSlug,
        eventSlug,
        eventPassId,
      });
    } else
      await passCache.updatePassCart({
        organizerSlug,
        eventSlug,
        pass: { eventPassId, quantity },
      });
  } else {
    if (quantity === 0) {
      await userSdk.DeletePendingOrders({
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
  if (!isJestRunning()) {
    revalidateTag(`getOrderSum-${eventPassId}`);
    revalidateTag(`getEventPassCart-${eventPassId}`);
    revalidateTag('getEventPassesCart');
  }
}
