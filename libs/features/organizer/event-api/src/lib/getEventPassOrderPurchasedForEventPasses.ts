import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

interface getExistingEventPassesProps {
  eventPassIds: string[];
}

export const getEventPassOrderPurchasedForEventPasses = async ({
  eventPassIds,
}: getExistingEventPassesProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data = await userSdk.GetEventPassOrderPurchasedForEventPassesIds(
    {
      eventPassIds,
    },
    {
      next: {
        tags: ['GetEventPassOrderPurchasedForEventPassesIds'],
      },
    },
  );
  return data?.eventPassOrder;
};
