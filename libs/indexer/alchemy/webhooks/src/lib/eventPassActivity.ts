import { getAlchemyInfosFromEventId } from '@features/back-office/events-api';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
import type {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
} from '@indexer/alchemy/types';
import { EventPassNftWrapper } from '@nft/event-pass';
import type { NftTransferWithoutMetadata } from '@nft/types';
import { WebhookType } from 'alchemy-sdk';
import { headers } from 'next/headers';
import {
  addAlchemyContextToRequest,
  isValidSignatureForAlchemyRequest,
  processNftActivities,
} from './utils';

const alchemy = new AlchemyWrapper();

export const extractNftTransfersFromEvent = (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
) => {
  const nftTransfers: NftTransferWithoutMetadata[] = [];
  const processedActivities = processNftActivities(alchemyWebhookEvent);
  const network = alchemyWebhookEvent.event.network;

  for (const {
    fromAddress,
    toAddress,
    contractAddress,
    tokenId,
    transactionHash,
    blockNum,
  } of processedActivities) {
    nftTransfers.push({
      fromAddress,
      toAddress,
      contractAddress,
      blockNumber: blockNum,
      tokenId,
      chainId: alchemy.convertNetworkToChainId(network).toString(),
      transactionHash,
    });
  }

  return nftTransfers;
};

export async function eventPassActivity(req: AlchemyRequest, eventId: string) {
  const body = await req.text();
  const signature = headers().get('x-alchemy-signature') as string;
  addAlchemyContextToRequest(req, body, signature);
  const params = await getAlchemyInfosFromEventId({ eventId: eventId });
  const activityWebhookSigningKey = params.activityWebhookSigningKey;
  if (
    !activityWebhookSigningKey ||
    !isValidSignatureForAlchemyRequest(req, activityWebhookSigningKey)
  ) {
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

  const nftTransfersFromEvent =
    extractNftTransfersFromEvent(alchemyWebhookEvent);
  if (nftTransfersFromEvent.length) {
    const eventPassNftWrapper = new EventPassNftWrapper();
    try {
      const NftTransfersNotCreated =
        await eventPassNftWrapper.getEventPassNftTransfersMetadata(
          nftTransfersFromEvent,
          chainId,
        );
      if (!NftTransfersNotCreated.length) {
        return new Response(
          'Error, not finding any NFT corresponding to the NFT transfer',
          {
            status: 500,
          },
        );
      }
      const nftTransfers = await eventPassNftWrapper.upsertNftTransfers(
        NftTransfersNotCreated,
      );
      const updatedNfts =
        await eventPassNftWrapper.updateEventPassNftFromNftTransfer(
          nftTransfers,
        );
      await eventPassNftWrapper.applyQrCodeBatchTransferForNewOwner(
        updatedNfts,
      );
    } catch (e) {
      console.error(e);
      return new Response('Error processing nft transfers', {
        status: 500,
      });
    }
  } else {
    return new Response('No nft transfers found in event', {
      status: 500,
    });
  }
  return new Response(null, { status: 200 });
}
