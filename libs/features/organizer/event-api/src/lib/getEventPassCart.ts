import { EventSlugs } from '@features/organizer/event-types';
import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

const passCache = new PassCache();

interface getEventPassCartProps extends EventSlugs {
  eventPassId: string;
}

export const getEventPassCart = async ({
  organizerSlug,
  eventSlug,
  eventPassId,
}: getEventPassCartProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return await passCache.getPassCart({
      organizerSlug,
      eventSlug,
      eventPassId,
    });
  }
  const data = await userSdk.GetPendingOrderForEventPass(
    {
      eventPassId,
    },
    {
      next: {
        tags: [`getEventPassCart-${eventPassId}`],
      },
    },
  );
  return data?.pendingOrder?.[0];
};
