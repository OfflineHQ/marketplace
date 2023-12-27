import { userSdk } from '@gql/user/api';

export const getOrdersConfirmed = async () => {
  const res = await userSdk.GetOrdersConfirmed(
    {},
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.eventPassOrder;
};
