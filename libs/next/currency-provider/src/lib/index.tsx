'use client';

import { CurrencyRates } from '@currency/types';
import { ReactNode, createContext, useContext } from 'react';

export const CurrencyContext = createContext({ rates: {}, isLoading: true });

export const CurrencyProvider = ({
  children,
  rates,
}: {
  children: ReactNode;
  rates: CurrencyRates;
}) => {
  return (
    <CurrencyContext.Provider
      value={{
        rates,
        isLoading: !!rates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
