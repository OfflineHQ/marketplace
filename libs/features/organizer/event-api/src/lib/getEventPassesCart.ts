import { EventSlugs } from '@features/organizer/event-types';
import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { cache } from 'react';

const passeCache = new PassCache();

interface getEventPassesCartProps extends EventSlugs {
  eventPassIds: string[];
}

export const getEventPassesCart = cache(
  async ({
    organizerSlug,
    eventSlug,
    eventPassIds,
  }: getEventPassesCartProps) => {
    const user = await getCurrentUser();
    if (!user) {
      return await passeCache.getPassesCart({ organizerSlug, eventSlug });
    }
    const data = await userSdk.GetEventPassPendingOrderForEventPasses(
      {
        eventPassIds,
      },
      {
        next: {
          tags: ['getEventPassesCart'],
        },
      },
    );
    return data?.eventPassPendingOrder;
  },
);
