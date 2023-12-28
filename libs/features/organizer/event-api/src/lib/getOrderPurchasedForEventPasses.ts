import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

interface getExistingEventPassesProps {
  eventPassIds: string[];
}

export const getOrderPurchasedForEventPasses = async ({
  eventPassIds,
}: getExistingEventPassesProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data = await userSdk.GetOrderPurchasedForEventPassesIds(
    {
      eventPassIds,
    },
    {
      next: {
        tags: ['GetOrderPurchasedForEventPassesIds'],
      },
    },
  );
  return data?.order;
};
