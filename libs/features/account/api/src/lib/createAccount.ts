import { adminSdk } from '@gql/admin/api';
import type { CreateAccountMutation } from '@gql/admin/types';
import type { Account_Insert_Input } from '@gql/shared/types';
import { ethers } from 'ethers';

export type CreateAccountInput = Required<
  Pick<Account_Insert_Input, 'address'>
>;

export const createAccount = async (
  account: CreateAccountInput,
): Promise<CreateAccountMutation['insert_account_one']> => {
  if (!account.address) {
    throw new Error('Address is required');
  }
  // TODO add Posthog analytics ?
  const data = await adminSdk.CreateAccount({
    account: { ...account, address: account.address.toLowerCase() },
  });
  if (data?.insert_account_one) {
    data.insert_account_one.address = ethers.utils.getAddress(
      data.insert_account_one.address,
    );
    return data.insert_account_one;
  }
  return null;
};
