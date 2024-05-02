import { CreateAccountInput, createAccount } from './createAccount';
import { Account, getAccount } from './getAccount';

export const handleAccount = async (
  account: CreateAccountInput,
): Promise<Account> => {
  if (!account.address) {
    throw new Error('Address is required');
  }
  const _account = await getAccount(account.address);
  if (!_account) {
    return createAccount(account) as Promise<Account>;
  }
  return _account;
};
