import { adminSdk } from '@next/gql/admin';
export const getUser = async (address) => {
  const data = await adminSdk.GetUser({ address });
  return data?.users[0] || null;
};
