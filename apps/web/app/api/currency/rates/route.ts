import { getRates } from '@next/currency-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const rates = await getRates();

    return new NextResponse(JSON.stringify(rates), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch rates' }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}
