import { userSdk } from '@gql/user/api';

export const getEventPassPendingOrdersMinimal = async () => {
  const res = await userSdk.GetEventPassPendingOrdersMinimal();
  return res.eventPassPendingOrder;
};
