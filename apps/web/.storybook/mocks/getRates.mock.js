import { useCurrency } from './currencyProvider.mock';
export async function getRates() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { rates } = useCurrency();
  return Promise.resolve(rates);
}
