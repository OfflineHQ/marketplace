import {
  isValidSignatureForAlchemyRequest,
  addAlchemyContextToRequest,
} from './utils';
import type { NftTransferWithoutMetadata } from '@nft/types';
import { WebhookType } from 'alchemy-sdk';
import type { AlchemyNFTActivityEvent, AlchemyRequest } from './types';
import { headers } from 'next/headers';
import { EventPassNftWrapper } from '@nft/eventPass';
import { hexToBigInt } from '@utils';
import { AlchemyWrapper } from '@indexer/alchemy/admin';

const alchemy = new AlchemyWrapper();

// https://docs.alchemy.com/reference/nft-activity-webhook
export const extractNftTransfersFromEvent = (
  alchemyWebhookEvent: AlchemyNFTActivityEvent
) => {
  const nftActivities = alchemyWebhookEvent.event.activity;
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
      network,
    } = activity;
    const { transactionHash, removed } = activity.log;
    if (removed) {
      console.error(
        `NFT transfer: ${transactionHash} in ${network} for ${contractAddress} collection, fromAddress ${fromAddress} toAddress ${toAddress} with erc721TokenId ${erc721TokenId} was removed likely due to a reorg`
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
  if (
    !isValidSignatureForAlchemyRequest(
      req,
      process.env.ALCHEMY_SIGNING_KEY as string
    )
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
  const chainId = alchemy
    .convertNetworkToChainId(alchemyWebhookEvent.event.activity[0].network)
    .toString();

  const nftTransfersFromEvent =
    extractNftTransfersFromEvent(alchemyWebhookEvent);
  if (nftTransfersFromEvent.length) {
    const eventPassNftWrapper = new EventPassNftWrapper();
    try {
      console.log('nftTransfersFromEvent', nftTransfersFromEvent);
      const NftTransfersNotCreated =
        await eventPassNftWrapper.getEventPassNftTransfersMetadata(
          nftTransfersFromEvent,
          chainId
        );
      console.log('NftTransfersNotCreated', NftTransfersNotCreated);
      const nftTransfers = await eventPassNftWrapper.upsertNftTransfers(
        NftTransfersNotCreated
      );
      const updatedNfts =
        await eventPassNftWrapper.updateEventPassNftFromNftTransfer(
          nftTransfers
        );
      await eventPassNftWrapper.applyQrCodeBatchTransferForNewOwner(
        updatedNfts
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
