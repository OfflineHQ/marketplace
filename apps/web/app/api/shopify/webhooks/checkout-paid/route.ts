import { ShopifyWebhookAndApiHandler } from '@integrations/external-api-handlers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const shopifyHandler = new ShopifyWebhookAndApiHandler();
  const body = await req.text();
  const shopifyHmacHeader = req.headers.get('X-Shopify-Hmac-SHA256');
  const shopDomain = req.headers.get('x-shopify-shop-domain');
  const topic = req.headers.get('x-shopify-topic');

  if (!shopifyHmacHeader) {
    console.error('Missing Shopify HMAC header.');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const isValid = shopifyHandler.verifySignature({
    integritySecret: 'c886ebdff67650455049c4cc52517c0d',
    body,
    signature: shopifyHmacHeader,
  });

  if (isValid) {
    console.log(`Handle webhook for shop ${shopDomain} and topic ${topic}`);
    return new NextResponse(null, { status: 200 });
  } else {
    console.error('HMAC validation failed.');
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
