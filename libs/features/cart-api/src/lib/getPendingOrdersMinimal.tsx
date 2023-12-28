import { userSdk } from '@gql/user/api';

export const getPendingOrdersMinimal = async () => {
  const res = await userSdk.GetPendingOrdersMinimal(
    {},
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.pendingOrder;
};
