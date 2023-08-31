// eslint-disable-next-line import/no-unresolved
import '@next/types';

import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import type {
  GetPassedEventsWithEventPassNftsQueryVariables,
  GetPassedEventsWithEventPassNftsQuery,
} from '@gql/user/types';
import { cache } from 'react';
import { getCurrentUser } from '@next/next-auth/user';

type GetPassedEventsWithEventPassNftsUserProps = Omit<
  GetPassedEventsWithEventPassNftsQueryVariables,
  'stage' | 'address'
>;

export const getPassedEventsWithEventPassNfts = cache(
  async (props: GetPassedEventsWithEventPassNftsUserProps) => {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not logged in');
    const data = await userSdk.GetPassedEventsWithEventPassNfts({
      ...props,
      address: user.address,
      stage: process.env.HYGRAPH_STAGE as Stage,
    });
    return data?.eventParameters;
  }
);
