import { Money, Rates } from '@currency/types';
import { toDecimal } from 'dinero.js';
import { toUserCurrency } from './toUserCurrency';
export const formatCurrency = (
  format: any,
  money: Money | undefined | null,
  rates: { [key: string]: Rates },
) => {
  if (!money) return format.number(0, { style: 'currency', currency: 'EUR' });
  const { currency, amount } = money;
  const formattedAmount = toUserCurrency({ amount, currency }, rates);

  return format.number(toDecimal(formattedAmount.dinero), {
    style: 'currency',
    currency: formattedAmount.currency,
  });
};
