'use client';

import { getCookie, setCookie } from 'cookies-next';

import { Money, Rates, currencyMap, defaultCurrency } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { getRates } from '@next/currency-cache';
import { Dinero, convert, dinero, toDecimal } from 'dinero.js';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const CurrencyContext = createContext({ rates: {}, isLoading: true });

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRates()
      .then((data) => {
        setRates(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching rates:', error);
      });
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        rates,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

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

export const formatCurrency = (
  format: any,
  money: Money | undefined | null,
  rates: { [key: string]: Rates }
) => {
  if (!money) return format.number(0, { style: 'currency', currency: 'EUR' });
  const { currency, amount } = money;
  const formattedAmount = toUserCurrency({ amount, currency }, rates);

  return format.number(toDecimal(formattedAmount.dinero), {
    style: 'currency',
    currency: formattedAmount.currency,
  });
};
