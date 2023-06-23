import { getCookie, setCookie } from 'cookies-next';

import { Currency as CurrencyType } from '@gql/shared/types';
import { dinero, convert, toDecimal, Dinero } from 'dinero.js';
import { EUR, USD, AED, CNY, QAR, SGD } from '@dinero.js/currencies';

export type Money = {
  amount: number;
  currency?: CurrencyType | null;
};

// Set default currency
const defaultCurrency: CurrencyType = CurrencyType.Eur;

// Create a mapping from your currency enum to the dinero currency objects
const currencyMap = {
  [CurrencyType.Eur]: EUR,
  [CurrencyType.Usd]: USD,
  [CurrencyType.Aed]: AED,
  [CurrencyType.Cny]: CNY,
  [CurrencyType.Qar]: QAR,
  [CurrencyType.Sgd]: SGD,
};

// Set user's currency preference in a cookie
export const setCurrencyPreference = (currency: CurrencyType) => {
  setCookie('currency', currency);
};

// Get user's currency preference from a cookie
export const getCurrencyPreference = (): CurrencyType => {
  return (getCookie('currency') as unknown as CurrencyType) || defaultCurrency;
};

// TODO fix rates because it will depend of the currency from money. Here it's as if money is always in EUR
// Fixed rates for conversion (to be replaced by dynamic rates from the server)
const rates = {
  [CurrencyType.Eur]: { amount: 1, scale: 0 },
  [CurrencyType.Usd]: { amount: 1.12, scale: 0 },
  [CurrencyType.Aed]: { amount: 4.13, scale: 0 },
  [CurrencyType.Cny]: { amount: 7.15, scale: 0 },
  [CurrencyType.Qar]: { amount: 4.08, scale: 0 },
  [CurrencyType.Sgd]: { amount: 1.52, scale: 0 },
};

export const toUserCurrency = (
  money: Money
): {
  dinero: Dinero<number>;
  currency: CurrencyType;
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
