import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

interface getExistingEventPassProps {
  eventPassId: string;
}

export const getEventPassOrderPurchasedForEventPass = async ({
  eventPassId,
}: getExistingEventPassProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data = await userSdk.GetEventPassOrderPurchasedForEventPassesId(
    {
      eventPassId,
    },
    {
      next: {
        tags: [`GetEventPassOrderPurchasedForEventPassesId-${eventPassId}`],
      },
    },
  );
  return data?.eventPassOrder;
};
