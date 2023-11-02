'use client';

import { CurrencyCache } from '@next/currency-cache';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const currencyCache = new CurrencyCache();

export const CurrencyContext = createContext({ rates: {}, isLoading: true });

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    currencyCache
      .getRates()
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
