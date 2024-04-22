import type { CreateAccountMutation } from '@gql/admin/types';
import type { Account_Insert_Input } from '@gql/shared/types';
export type CreateAccountInput = Required<
  Pick<Account_Insert_Input, 'address'>
>;
export declare const createAccount: (
  account: CreateAccountInput,
) => Promise<CreateAccountMutation['insert_account_one']>;
