import { EventSlugs } from '@features/organizer/event-types';
import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

const passCache = new PassCache();

interface getEventPassesCartProps extends EventSlugs {
  eventPassIds: string[];
}

export const getEventPassesCart = async ({
  organizerSlug,
  eventSlug,
  eventPassIds,
}: getEventPassesCartProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return await passCache.getPassesCart({ organizerSlug, eventSlug });
  }
  const data = await userSdk.GetPendingOrderForEventPasses(
    {
      eventPassIds,
    },
    {
      next: {
        tags: ['getEventPassesCart'],
      },
    },
  );
  return data?.pendingOrder;
};
