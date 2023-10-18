import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { cache } from 'react';

interface getExistingEventPassProps {
  eventPassId: string;
}

export const getEventPassOrdersConfirmedOrCompletedForEventPassId = cache(
  async ({ eventPassId }: getExistingEventPassProps) => {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    const data =
      await userSdk.GetEventPassOrdersConfirmedOrCompletedForEventPassId(
        {
          eventPassId,
        },
        {
          next: {
            tags: [
              `GetEventPassOrdersConfirmedOrCompletedForEventPassId-${eventPassId}`,
            ],
          },
        },
      );
    return data?.eventPassOrder;
  },
);
