import { adminSdk } from '@gql/admin/api';
import type {
  Account_Insert_Input,
  CreateAccountMutation,
} from '@gql/admin/types';

export const createAccount = async (
  account: Account_Insert_Input
): Promise<CreateAccountMutation['insert_account_one']> => {
  // TODO add segment analytics
  const data = await adminSdk.CreateAccount({ account });
  return data?.insert_account_one || null;
};
