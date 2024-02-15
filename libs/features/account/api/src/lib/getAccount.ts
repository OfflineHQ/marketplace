import { adminSdk } from '@gql/admin/api';
import type { GetAccountQuery } from '@gql/admin/types';
import { ethers } from 'ethers';

export type Account = GetAccountQuery['account'][number];

export const getAccount = async (address: string): Promise<Account | null> => {
  const data = await adminSdk.GetAccount(
    { address: address.toLowerCase() },
    {
      cache: 'no-store',
    },
  );

  if (data?.account[0]) {
    data.account[0].address = ethers.utils.getAddress(data.account[0].address);
    return data.account[0];
  }
  return null;
};
