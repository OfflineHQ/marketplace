import {
  isValidSignatureForAlchemyRequest,
  addAlchemyContextToRequest,
} from './utils';
import { WebhookType } from 'alchemy-sdk';
import type { AlchemyNFTActivityEvent, AlchemyRequest } from './types';
import { headers } from 'next/headers';

export async function POST(req: AlchemyRequest) {
  const body = await req.text();
  const signature = headers().get('x-alchemy-signature') as string;
  addAlchemyContextToRequest(req, body, signature);
  if (
    !isValidSignatureForAlchemyRequest(req, process.env.ALCHEMY_SIGNING_KEY)
  ) {
    return new Response('Signature validation failed, unauthorized!', {
      status: 403,
    });
  }

  // Handle the webhook event
  const alchemyWebhookEvent: AlchemyNFTActivityEvent = JSON.parse(body);

  if (alchemyWebhookEvent.type !== WebhookType.NFT_ACTIVITY) {
    throw new Error('Invalid webhook type. Expected NFT_ACTIVITY.');
  }

  return new Response(null, { status: 200 });
}
