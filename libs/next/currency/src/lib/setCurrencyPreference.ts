import { Currency_Enum } from '@gql/shared/types';
import { setCookie } from 'cookies-next';
// Set user's currency preference in a cookie
export const setCurrencyPreference = (currency: Currency_Enum) => {
  setCookie('NEXT_CURRENCY', currency);
};
