// eslint-disable-next-line import/no-unresolved
import '@next/types';

import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import type { GetUpcomingEventsWithEventPassNftsQueryVariables } from '@gql/user/types';
import { cache } from 'react';
import { getCurrentUser } from '@next/next-auth/user';
import env from '@env/server';

type GetUpcomingEventsWithEventPassNftsUserProps = Omit<
  GetUpcomingEventsWithEventPassNftsQueryVariables,
  'stage' | 'address'
>;

export const getUpcomingEventsWithEventPassNfts = cache(
  async (props: GetUpcomingEventsWithEventPassNftsUserProps) => {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not logged in');
    const data = await userSdk.GetUpcomingEventsWithEventPassNfts(
      {
        ...props,
        address: user.address,
        stage: env.HYGRAPH_STAGE as Stage,
      },
      { next: { tags: ['userEventPassNfts'] } }
    );
    return data?.eventParameters;
  }
);
