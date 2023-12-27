import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

interface getExistingEventPassProps {
  eventPassId: string;
}

export const getOrderPurchasedForEventPass = async ({
  eventPassId,
}: getExistingEventPassProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data = await userSdk.GetOrderPurchasedForEventPassesId(
    {
      eventPassId,
    },
    {
      next: {
        tags: [`GetOrderPurchasedForEventPassesId-${eventPassId}`],
      },
    },
  );
  return data?.order;
};
