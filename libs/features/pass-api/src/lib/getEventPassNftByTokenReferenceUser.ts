import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { GetEventPassNftByTokenReferenceQueryVariables } from '@gql/user/types';
import { cache } from 'react';
import env from '@env/server';

type GetEventPassNftByTokenReferenceUserProps = Omit<
  GetEventPassNftByTokenReferenceQueryVariables,
  'stage' | 'chainId'
>;

export const getEventPassNftByTokenReferenceUser = cache(
  async (props: GetEventPassNftByTokenReferenceUserProps) => {
    const data = await userSdk.GetEventPassNftByTokenReference({
      ...props,
      stage: env.HYGRAPH_STAGE as Stage,
      chainId: env.CHAIN,
    });
    return data?.eventPassNft?.[0];
  }
);
