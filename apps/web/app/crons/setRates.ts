import { setRatesCron } from '@next/currency-cache';

export default async function handler() {
  return await setRatesCron();
}
