import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';
import { cache } from 'react';

interface getExistingEventPassesProps {
  eventPassIds: string[];
}

export const getEventPassOrdersConfirmedOrCompletedForEventPassIds = cache(
  async ({ eventPassIds }: getExistingEventPassesProps) => {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    const data =
      await userSdk.GetEventPassOrdersConfirmedOrCompletedForEventPassIds(
        {
          eventPassIds,
        },
        {
          next: {
            tags: ['GetEventPassOrdersConfirmedOrCompletedForEventPassIds'],
          },
        },
      );
    return data?.eventPassOrder;
  },
);
