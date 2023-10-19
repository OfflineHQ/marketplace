import { userSdk } from '@gql/user/api';

export const getEventPassOrdersConfirmed = async () => {
  const res = await userSdk.GetEventPassOrdersConfirmed(
    {},
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.eventPassOrder;
};
