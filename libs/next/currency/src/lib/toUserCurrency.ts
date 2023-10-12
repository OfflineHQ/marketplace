import { Money, Rates, currencyMap, defaultCurrency } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { Dinero, convert, dinero } from 'dinero.js';
import { getCurrencyPreference } from './getCurrencyPreference';

export const toUserCurrency = (
  money: Money,
  rates: { [key: string]: Rates }
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
  const currencyRate = rates[userCurrency as string];
  const convertedDinero = convert(dineroObject, toCurrency, currencyRate);
  return {
    dinero: convertedDinero,
    currency: userCurrency,
  };
};
