import { userSdk } from '@gql/user/api';

export const getAccountKyc = async () => {
  const res = await userSdk.GetKyc();
  return res?.kyc?.[0] || null;
};
