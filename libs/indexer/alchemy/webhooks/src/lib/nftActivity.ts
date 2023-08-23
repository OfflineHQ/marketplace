import {
  isValidSignatureForAlchemyRequest,
  addAlchemyContextToRequest,
} from './utils';
import type { NftTransferWithoutMetadata } from '@nft/types';
import { WebhookType } from 'alchemy-sdk';
import type { AlchemyNFTActivityEvent, AlchemyRequest } from './types';
import { headers } from 'next/headers';
import { EventPassNftWrapper } from '@nft/eventPass';

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
      nftTransfers.push({
        fromAddress,
        toAddress,
        contractAddress,
        blockNumber: blockNumber, // TODO: convert to bigint
        tokenId: erc721TokenId, // TODO: convert to bigint
        chainId: network, // TODO: convert to chainId hex string
        transactionHash,
      });
    }
  }
  return nftTransfers;
};

export async function nftActivity(
  req: AlchemyRequest,
  contractAddress: string
) {
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
    throw new Error('Invalid webhook type. Expected NFT_ACTIVITY.');
  }
  const chainId = alchemyWebhookEvent.event.activity[0].network; // TODO: convert to chainId hex string

  const eventPassNftWrapper = new EventPassNftWrapper();
  const nftTransfersFromEvent =
    extractNftTransfersFromEvent(alchemyWebhookEvent);
  const NftTransfersNotCreated =
    await eventPassNftWrapper.getEventPassNftTransfersMetadata(
      nftTransfersFromEvent,
      contractAddress,
      chainId
    );

  const nftTransfers = await eventPassNftWrapper.upsertNftTransfers(
    NftTransfersNotCreated
  );
  const updatedNfts =
    await eventPassNftWrapper.updateEventPassNftFromNftTransfer(nftTransfers);
  await eventPassNftWrapper.applyQrCodeBatchTransferForNewOwner(updatedNfts);
  return new Response(null, { status: 200 });
}
