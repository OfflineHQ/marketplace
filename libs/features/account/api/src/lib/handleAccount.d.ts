import { CreateAccountInput } from './createAccount';
import { Account } from './getAccount';
export declare const handleAccount: (
  account: CreateAccountInput,
) => Promise<Account>;
