import { adminSdk } from '@gql/admin/api';
import type { GetAccountQuery } from '@gql/admin/types';

export type Account = GetAccountQuery['account'][number];

export const getAccount = async (address: string): Promise<Account> => {
  const data = await adminSdk.GetAccount({ address });
  return data?.account[0] || null;
};
