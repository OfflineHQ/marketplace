import { cache } from 'react';
import { userSdk } from '@gql/user/api';
// TODO invalidate cache for the GetEventPassPendingOrders query when the user adds or removes an event pass
export const getEventPassPendingOrders = cache(async () => {
  const res = await userSdk.GetEventPassPendingOrders();
  return res.eventPassPendingOrder;
});
