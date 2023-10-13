'use client';

import { getRates } from '@next/currency-cache';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export const CurrencyContext = createContext({ rates: {}, isLoading: true });

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
