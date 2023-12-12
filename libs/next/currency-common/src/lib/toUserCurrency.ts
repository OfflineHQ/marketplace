import { Money, Rates, currencyMap, defaultCurrency } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { Dinero, convert, dinero } from 'dinero.js';
import { getCurrencyPreference } from './getCurrencyPreference';

export const toUserCurrency = (
  money: Money,
  rates: { [key: string]: Rates },
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

  if (money.currency === userCurrency || Object.keys(rates).length === 0)
    return {
      dinero: dineroObject,
      currency: userCurrency,
    };

  if (!rates[money.currency as string]) {
    throw new Error(`No rates found for currency: ${money.currency}`);
  }

  const currencyRate = rates[money.currency as string][toCurrency.code];
  const adjustedRate = {
    [toCurrency.code]: {
      amount: Math.round(currencyRate * 10000),
      scale: 4,
    },
  };
  const convertedDinero = convert(dineroObject, toCurrency, adjustedRate);
  return {
    dinero: convertedDinero,
    currency: userCurrency,
  };
};
