import { userSdk } from '@gql/user/api';

export const getEventPassOrdersIsMinting = async () => {
  const res = await userSdk.GetEventPassOrdersIsMinting(
    {},
    { cache: 'no-store' }, // TODO: remove this when we have a proper cache invalidation strategy
  );
  return res.eventPassOrder;
};
