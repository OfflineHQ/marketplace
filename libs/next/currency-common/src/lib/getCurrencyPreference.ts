import { defaultCurrency } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { isJestRunning } from '@utils';
import { cookies } from 'next/headers';

// Get user's currency preference from a cookie
export const getCurrencyPreference = (): Currency_Enum => {
  if (isJestRunning()) {
    return defaultCurrency;
  }
  return (
    (cookies().get('NEXT_CURRENCY')?.value as unknown as Currency_Enum) ||
    defaultCurrency
  );
};
