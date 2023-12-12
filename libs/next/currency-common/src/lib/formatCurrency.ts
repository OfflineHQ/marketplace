import { Money, Rates } from '@currency/types';
import { Currency_Enum } from '@gql/shared/types';
import { toDecimal } from 'dinero.js';
import { toUserCurrency } from './toUserCurrency';
export const formatCurrency = (
  format: any,
  money: Money | undefined | null,
  rates: { [key: string]: Rates },
) => {
  // If money is not provided, use default values
  const { currency, amount = 0 } = money || {
    currency: Currency_Enum.Eur,
    amount: 0,
  };

  // If currency is not provided, use 'EUR' as default
  const effectiveCurrency = currency || Currency_Enum.Eur;

  if (!rates) {
    console.error('No rates provided');
    return undefined;
  }

  const formattedAmount = toUserCurrency(
    { amount, currency: effectiveCurrency },
    rates,
  );
  return format.number(toDecimal(formattedAmount.dinero), {
    style: 'currency',
    currency: formattedAmount.currency,
  });
};
