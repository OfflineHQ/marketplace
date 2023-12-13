import { createContext } from 'react';

const CurrencyContext = createContext({ rates: {}, isLoading: true });

const rates = {
  EUR: {
    CAD: 1.565,
    CHF: 1.1798,
    GBP: 0.87295,
    SEK: 10.2983,
    USD: 1.2234,
    EUR: 1,
  },
  USD: {
    USD: 1,
    EUR: 0.9522,
    GBP: 0.8253,
  },
};

export const CurrencyProvider = ({ children }) => {
  return (
    <CurrencyContext.Provider
      value={{
        rates,
        isLoading: false,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// export const useCurrency = () => useContext(CurrencyContext);

export function useCurrency() {
  // Your mock implementation here
  return {
    rates: {
      EUR: {
        CAD: 1.565,
        CHF: 1.1798,
        GBP: 0.87295,
        SEK: 10.2983,
        USD: 1.2234,
        EUR: 1,
      },
      USD: {
        USD: 1,
        EUR: 0.9522,
        GBP: 0.8253,
      },
    },
    isLoading: false,
  };
}
