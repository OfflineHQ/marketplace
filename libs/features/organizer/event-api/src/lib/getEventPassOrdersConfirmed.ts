import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

export const getEventPassOrdersConfirmed = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data = await userSdk.GetEventPassOrdersConfirmed(
    {},
    {
      next: {
        tags: ['GetEventPassOrdersConfirmed'],
      },
    },
  );
  return data?.eventPassOrder;
};
