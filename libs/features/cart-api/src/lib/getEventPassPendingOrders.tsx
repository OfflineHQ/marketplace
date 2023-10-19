import env from '@env/server';
import { type Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';

export const getEventPassPendingOrders = async () => {
  const res = await userSdk.GetEventPassPendingOrders(
    {
      stage: env.HYGRAPH_STAGE as Stage,
    },
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.eventPassPendingOrder;
};
