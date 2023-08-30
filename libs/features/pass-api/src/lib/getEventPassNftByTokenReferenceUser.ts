import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { GetEventPassNftByTokenReferenceQueryVariables } from '@gql/user/types';
import { cache } from 'react';

type GetEventPassNftByTokenReferenceUserProps = Omit<
  GetEventPassNftByTokenReferenceQueryVariables,
  'stage' | 'chainId'
>;

export const getEventPassNftByTokenReferenceUser = cache(
  async (props: GetEventPassNftByTokenReferenceUserProps) => {
    const data = await userSdk.GetEventPassNftByTokenReference({
      ...props,
      stage: process.env.HYGRAPH_STAGE as Stage,
      chainId: process.env.CHAIN as string,
    });
    return data?.eventPassNft?.[0];
  }
);
