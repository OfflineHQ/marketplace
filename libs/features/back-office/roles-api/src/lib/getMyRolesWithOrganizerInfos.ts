import env from '@env/server';
import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { isConnected } from '@next/next-auth/user';
import { cache } from 'react';

export const getMyRolesWithOrganizerInfos = cache(async () => {
  if (!isConnected()) throw new Error('User not connected');
  const data = await userSdk.GetMyRolesWithOrganizerInfos(
    {
      stage: env.HYGRAPH_STAGE as Stage,
    },
    {
      next: {
        tags: ['my-roles'],
      },
    },
  );
  return data?.roleAssignments;
});
