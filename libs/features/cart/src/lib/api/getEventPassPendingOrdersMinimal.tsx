import { userSdk } from '@gql/user/api';

export const getEventPassPendingOrdersMinimal = async () => {
  const res = await userSdk.GetEventPassPendingOrdersMinimal(
    {},
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.eventPassPendingOrder;
};
