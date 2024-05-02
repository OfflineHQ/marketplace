import type { GetAccountQuery } from '@gql/admin/types';
export type Account = GetAccountQuery['account'][number];
export declare const getAccount: (address: string) => Promise<Account | null>;
