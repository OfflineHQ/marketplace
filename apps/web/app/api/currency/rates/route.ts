import { getRates } from '@next/currency-cache';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    revalidatePath('/');
    console.log('I was in the route');
    const rates = await getRates();
    console.log('Rates', rates);

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
