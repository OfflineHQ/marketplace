import { userSdk } from '@gql/user/api';
import { isConnected } from '@next/next-auth/user';
import { cache } from 'react';

export const getMyRoles = cache(async () => {
  if (!isConnected()) throw new Error('User not connected');
  const data = await userSdk.GetMyRoles(
    {},
    {
      next: {
        tags: ['my-roles'],
      },
    },
  );
  return data?.roleAssignment;
});
