// utils.ts
import { getAlchemyInfosFromEventId } from '@features/pass-api';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
import {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
} from '@indexer/alchemy/types';
import { WebhookType } from 'alchemy-sdk';
import { headers } from 'next/headers';
import {
  addAlchemyContextToRequest,
  isValidSignatureForAlchemyRequest,
} from './utils';

const alchemy = new AlchemyWrapper();

export async function handleAlchemyRequest(
  req: AlchemyRequest,
  eventId: string,
) {
  const body = await req.text();
  const signature = headers().get('x-alchemy-signature') as string;
  addAlchemyContextToRequest(req, body, signature);
  const params = await getAlchemyInfosFromEventId({ eventId: eventId });
  const signingKey = params.signingKey;
  if (!signingKey || !isValidSignatureForAlchemyRequest(req, signingKey)) {
    return new Response('Signature validation failed, unauthorized!', {
      status: 403,
    });
  }

  const alchemyWebhookEvent: AlchemyNFTActivityEvent = JSON.parse(body);

  if (alchemyWebhookEvent.type !== WebhookType.NFT_ACTIVITY) {
    return new Response('Invalid webhook type. Expected NFT_ACTIVITY.', {
      status: 400,
    });
  }

  const chainId = alchemy.convertNetworkToChainId(
    alchemyWebhookEvent.event.network,
  );

  return { alchemyWebhookEvent, chainId };
}
