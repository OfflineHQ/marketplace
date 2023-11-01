import { useCurrency } from './currencyProvider.mock';
export async function getRates() {
  const { rates } = useCurrency();
  return Promise.resolve(rates);
}
