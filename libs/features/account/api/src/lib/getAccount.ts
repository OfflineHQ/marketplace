import { adminSdk, type GetAccountQuery } from '@next/gql/admin';

export type Account = GetAccountQuery['account'][number];

export const getAccount = async (address: string): Promise<Account> => {
  const data = await adminSdk.GetAccount({ address });
  return data?.account[0] || null;
};
