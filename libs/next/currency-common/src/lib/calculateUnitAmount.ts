import { CurrencyRates, Money } from '@currency/types';
import { toDecimal } from 'dinero.js';
import { toUserCurrency } from './toUserCurrency';

export const calculateUnitAmount = (
  money: Money,
  rates: CurrencyRates,
): number => {
  return Math.round(
    Number(
      toDecimal(
        toUserCurrency(
          {
            amount: money.amount,
            currency: money.currency,
          },
          rates,
        ).dinero,
      ),
    ) * 100,
  );
};
