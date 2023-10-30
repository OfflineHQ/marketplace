import { NextResponse } from 'next/server';
import { setRates } from '../next-currency-cache';

export default async function handler() {
  try {
    const result = await setRates();
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
