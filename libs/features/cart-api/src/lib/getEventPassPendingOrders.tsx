import env from '@env/server';
import { type Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';

export const getPendingOrders = async () => {
  const res = await userSdk.GetPendingOrders(
    {
      stage: env.HYGRAPH_STAGE as Stage,
    },
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.pendingOrder;
};
