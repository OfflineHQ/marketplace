import { ShopifyWebhookAndApiHandler } from '@integrations/external-api-handlers';
import { CustomError } from '@next/api-handler';
import { getErrorMessage } from '@utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params: { contractAddress } }: { params: { contractAddress: string } },
) {
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  try {
    return await shopifyHandler.mintLoyaltyCardWithPassword({
      req,
      contractAddress,
    });
  } catch (error: unknown) {
    const isCustomError = error instanceof CustomError;
    return new NextResponse(getErrorMessage(error), {
      status: isCustomError ? error.statusCode : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(
  req: NextRequest,
  { params: { contractAddress } }: { params: { contractAddress: string } },
) {
  console.log('GET contractAddress:', req, contractAddress);
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  try {
    return await shopifyHandler.hasLoyaltyCard({ req }, contractAddress);
  } catch (error: unknown) {
    const isCustomError = error instanceof CustomError;
    return new NextResponse(getErrorMessage(error), {
      status: isCustomError ? error.statusCode : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
