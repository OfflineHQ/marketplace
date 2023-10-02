import { getCookie, setCookie } from 'cookies-next';

import { Money, currencyMap, defaultCurrency, rates } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { Dinero, convert, dinero, toDecimal } from 'dinero.js';

// Set user's currency preference in a cookie
export const setCurrencyPreference = (currency: Currency_Enum) => {
  setCookie('NEXT_CURRENCY', currency);
};

// Get user's currency preference from a cookie
export const getCurrencyPreference = (): Currency_Enum => {
  return (
    (getCookie('NEXT_CURRENCY') as unknown as Currency_Enum) || defaultCurrency
  );
};

export const toUserCurrency = (
  money: Money
): {
  dinero: Dinero<number>;
  currency: Currency_Enum;
} => {
  const userCurrency = getCurrencyPreference();

  const fromCurrency = money.currency
    ? currencyMap[money.currency]
    : currencyMap[defaultCurrency];
  const toCurrency = currencyMap[userCurrency];
  const dineroObject = dinero({ amount: money.amount, currency: fromCurrency });

  if (money.currency === userCurrency)
    return {
      dinero: dineroObject,
      currency: userCurrency,
    };
  const convertedDinero = convert(dineroObject, toCurrency, rates);
  return {
    dinero: convertedDinero,
    currency: userCurrency,
  };
};

export const formatCurrency = (
  format: any,
  money: Money | undefined | null
) => {
  if (!money) return format.number(0, { style: 'currency', currency: 'EUR' });
  const { currency, amount } = money;
  const formattedAmount = toUserCurrency({ amount, currency });

  return format.number(toDecimal(formattedAmount.dinero), {
    style: 'currency',
    currency: formattedAmount.currency,
  });
};
