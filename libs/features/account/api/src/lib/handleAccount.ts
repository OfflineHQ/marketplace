import type { Account_Insert_Input } from '@gql/admin/types';
import { getAccount, type Account } from './getAccount';
import { createAccount } from './createAccount';

export const handleAccount = async (
  account: Account_Insert_Input
): Promise<Account> => {
  const _account = await getAccount(account.address as string);
  if (!_account) {
    return createAccount(account) as Promise<Account>;
  }
  return _account;
};
