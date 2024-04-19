import { ShopifyWebhookAndApiHandler } from '@integrations/external-api-handlers';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params: { contractAddress } }: { params: { contractAddress: string } },
) {
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  return shopifyHandler.mintLoyaltyCardWithCustomerId({
    req,
    contractAddress,
  });
}

export async function GET(
  req: NextRequest,
  { params: { contractAddress } }: { params: { contractAddress: string } },
) {
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  return shopifyHandler.hasLoyaltyCard({ req, contractAddress });
}
