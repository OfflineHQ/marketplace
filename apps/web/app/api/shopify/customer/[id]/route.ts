import { ShopifyWebhookAndApiHandler } from '@integrations/external-api-handlers';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  return shopifyHandler.createShopifyCustomer({
    req,
    id,
  });
}

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  return shopifyHandler.hasShopifyCustomer({ req, id });
}
