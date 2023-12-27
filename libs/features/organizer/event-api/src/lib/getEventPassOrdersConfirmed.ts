import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

export const getOrdersConfirmed = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data = await userSdk.GetOrdersConfirmed(
    {},
    {
      next: {
        tags: ['GetOrdersConfirmed'],
      },
    },
  );
  return data?.eventPassOrder;
};
