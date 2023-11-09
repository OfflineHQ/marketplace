import { getAlchemyInfosFromEventId } from '@features/pass-api';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
import type {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
} from '@indexer/alchemy/types';
import { EventPassNftWrapper } from '@nft/eventPass';
import type { NftTransferWithoutMetadata } from '@nft/types';
import { hexToBigInt } from '@utils';
import { WebhookType } from 'alchemy-sdk';
import { headers } from 'next/headers';
import {
  addAlchemyContextToRequest,
  isValidSignatureForAlchemyRequest,
} from './utils';

const alchemy = new AlchemyWrapper();

// https://docs.alchemy.com/reference/nft-activity-webhook
export const extractNftTransfersFromEvent = (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
) => {
  const nftActivities = alchemyWebhookEvent.event.activity;
  const network = alchemyWebhookEvent.event.network;
  const nftTransfers: NftTransferWithoutMetadata[] = [];
  if (!nftActivities?.length) {
    throw new Error('No nft activities found in event');
  }
  for (const activity of nftActivities) {
    const {
      fromAddress,
      toAddress,
      contractAddress,
      blockNumber,
      erc721TokenId,
    } = activity;
    const { transactionHash, removed } = activity.log;
    if (removed) {
      console.error(
        `NFT transfer: ${transactionHash} in ${network} for ${contractAddress} collection, fromAddress ${fromAddress} toAddress ${toAddress} with erc721TokenId ${erc721TokenId} was removed likely due to a reorg`,
      );
    } else {
      if (!erc721TokenId) {
        console.error(`No erc721TokenId found for ${transactionHash}`);
      } else
        nftTransfers.push({
          fromAddress,
          toAddress,
          contractAddress,
          blockNumber: hexToBigInt(blockNumber),
          tokenId: hexToBigInt(erc721TokenId),
          chainId: alchemy.convertNetworkToChainId(network).toString(),
          transactionHash,
        });
    }
  }
  return nftTransfers;
};

export async function nftActivity(req: AlchemyRequest, eventId: string) {
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
