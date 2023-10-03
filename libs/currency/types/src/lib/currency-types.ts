import { AED, CNY, EUR, GBP, QAR, SGD, USD } from '@dinero.js/currencies';
import { Currency_Enum } from '@gql/shared/types';

export type Money = {
  amount: number;
  currency?: Currency_Enum | null;
};

// Set default currency
export const defaultCurrency: Currency_Enum = Currency_Enum.Eur;

// Create a mapping from your currency enum to the dinero currency objects
export const currencyMap = {
  [Currency_Enum.Eur]: EUR,
  [Currency_Enum.Usd]: USD,
  [Currency_Enum.Gbp]: GBP,
  [Currency_Enum.Aed]: AED,
  [Currency_Enum.Cny]: CNY,
  [Currency_Enum.Qar]: QAR,
  [Currency_Enum.Sgd]: SGD,
};

// TODO fix rates because it will depend of the currency from money. Here it's as if money is always in EUR
// Fixed rates for conversion (to be replaced by dynamic rates from the server)
export const rates = {
  [Currency_Enum.Eur]: { amount: 1, scale: 0 },
  [Currency_Enum.Usd]: { amount: 1.12, scale: 0 },
  [Currency_Enum.Aed]: { amount: 4.13, scale: 0 },
  [Currency_Enum.Cny]: { amount: 7.15, scale: 0 },
  [Currency_Enum.Qar]: { amount: 4.08, scale: 0 },
  [Currency_Enum.Sgd]: { amount: 1.52, scale: 0 },
};

export enum Currency_Enum_Not_Const {
  AED = 'AED',
  CNY = 'CNY',
  EUR = 'EUR',
  GBP = 'GBP',
  QAR = 'QAR',
  SGD = 'SGD',
  USD = 'USD',
}
