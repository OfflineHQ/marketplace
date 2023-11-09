import { NextResponse } from 'next/server';
import { CurrencyCache } from '../next-currency-cache';

export default async function handler() {
  try {
    const currencyCache = new CurrencyCache();
    const result = await currencyCache.setRates();
    return new NextResponse(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error('Error setting rates', error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
