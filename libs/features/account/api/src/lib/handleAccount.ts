import type { Account_Insert_Input } from '@next/gql/admin';
import { getAccount, type Account } from './getAccount';
import { createAccount } from './createAccount';

export const handleAccount = async (
  account: Account_Insert_Input
): Promise<Account> => {
  const _account = await getAccount(account.address);
  if (!_account) {
    return createAccount(account);
  }
  return _account;
};
