import { userSdk } from '@gql/user/api';

export const getOrdersIsMinting = async () => {
  const res = await userSdk.GetOrdersIsMinting(
    {},
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.order;
};
