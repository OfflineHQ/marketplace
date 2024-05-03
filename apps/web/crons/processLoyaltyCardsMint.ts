import { handler as processLoyaltyCardsMintHandler } from '@features/loyalty-card-cron';
import { NextResponse } from 'next/server';

export default async function handler() {
  try {
    const result = await processLoyaltyCardsMintHandler();
    console.log(
      'Minting process completed successfully for loyaltyCard:',
      result,
    );
    return new NextResponse(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error('Error during the minting process for loyaltyCard:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
