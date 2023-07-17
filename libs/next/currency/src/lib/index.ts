import { getCookie, setCookie } from 'cookies-next';

import { Currency_Enum } from '@gql/shared/types';
import { dinero, convert, toDecimal, Dinero } from 'dinero.js';
import { EUR, USD, GBP, AED, CNY, QAR, SGD } from '@dinero.js/currencies';

export type Money = {
  amount: number;
  currency?: Currency_Enum | null;
};

// Set default currency
const defaultCurrency: Currency_Enum = Currency_Enum.Eur;

// Create a mapping from your currency enum to the dinero currency objects
const currencyMap = {
  [Currency_Enum.Eur]: EUR,
  [Currency_Enum.Usd]: USD,
  [Currency_Enum.Gbp]: GBP,
  [Currency_Enum.Aed]: AED,
  [Currency_Enum.Cny]: CNY,
  [Currency_Enum.Qar]: QAR,
  [Currency_Enum.Sgd]: SGD,
};

// Set user's currency preference in a cookie
export const setCurrencyPreference = (currency: Currency_Enum) => {
  setCookie('currency', currency);
};

// Get user's currency preference from a cookie
export const getCurrencyPreference = (): Currency_Enum => {
  return (getCookie('currency') as unknown as Currency_Enum) || defaultCurrency;
};

// TODO fix rates because it will depend of the currency from money. Here it's as if money is always in EUR
// Fixed rates for conversion (to be replaced by dynamic rates from the server)
const rates = {
  [Currency_Enum.Eur]: { amount: 1, scale: 0 },
  [Currency_Enum.Usd]: { amount: 1.12, scale: 0 },
  [Currency_Enum.Aed]: { amount: 4.13, scale: 0 },
  [Currency_Enum.Cny]: { amount: 7.15, scale: 0 },
  [Currency_Enum.Qar]: { amount: 4.08, scale: 0 },
  [Currency_Enum.Sgd]: { amount: 1.52, scale: 0 },
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
