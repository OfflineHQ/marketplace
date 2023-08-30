import { Stage } from '@gql/shared/types';
import { anonymousSdk } from '@gql/anonymous/api';
import { GetEventPassNftByTokenReferenceQueryVariables } from '@gql/user/types';
import { cache } from 'react';

type GetEventPassNftByTokenReferenceAnonymousProps = Omit<
  GetEventPassNftByTokenReferenceQueryVariables,
  'stage' | 'chainId'
>;

export const getEventPassNftByTokenReferenceAnonymous = cache(
  async (props: GetEventPassNftByTokenReferenceAnonymousProps) => {
    const data = await anonymousSdk.GetEventPassNftByTokenReference({
      ...props,
      stage: process.env.HYGRAPH_STAGE as Stage,
      chainId: process.env.CHAIN as string,
    });
    return data?.eventPassNft?.[0];
  }
);
