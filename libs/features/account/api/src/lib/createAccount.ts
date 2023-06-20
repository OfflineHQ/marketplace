import {
  adminSdk,
  type Account_Insert_Input,
  CreateAccountMutation,
} from '@next/gql/admin';

export const createAccount = async (
  account: Account_Insert_Input
): Promise<CreateAccountMutation['insert_account_one']> => {
  try {
    // TODO add segment analytics
    const data = await adminSdk.CreateAccount({ account });
    return data?.insert_account_one || null;
  } catch (error) {
    console.error({ error });
    throw error;
  }
};
