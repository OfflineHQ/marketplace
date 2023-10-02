import { setRates } from '@next/currency-cache';

export async function callSetRates() {
  try {
    const result = await setRates();
    console.log('Rates set successfully', result);
  } catch (error) {
    console.error('Error setting rates', error);
  }
}
