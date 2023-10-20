import { defaultCurrency } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { cookies } from 'next/headers';

// Get user's currency preference from a cookie
export const getCurrencyPreference = (): Currency_Enum => {
  return (
    (cookies().get('NEXT_CURRENCY')?.value as unknown as Currency_Enum) ||
    defaultCurrency
  );
};
