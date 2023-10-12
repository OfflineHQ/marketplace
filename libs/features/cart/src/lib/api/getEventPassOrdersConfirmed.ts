import { userSdk } from '@gql/user/api';

export const getEventPassOrdersConfirmed = async () => {
  const res = await userSdk.GetEventPassOrdersConfirmed();
  return res.eventPassOrder;
};
