'use server';

import { defaultCurrency } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { getCookie } from 'cookies-next';

// Get user's currency preference from a cookie
export const getCurrencyPreference = (): Currency_Enum => {
  return (
    (getCookie('NEXT_CURRENCY') as unknown as Currency_Enum) || defaultCurrency
  );
};
