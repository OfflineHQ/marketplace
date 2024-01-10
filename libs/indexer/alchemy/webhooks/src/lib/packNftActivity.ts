import type {
  AlchemyNFTActivityEvent,
  AlchemyRequest,
} from '@indexer/alchemy/types';
import { PackNftWrapper } from '@nft/event-pass';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { env } from 'process';
import { handleAlchemyRequest } from './common';

// https://docs.alchemy.com/reference/nft-activity-webhook
export const extractPackNftUpdatesFromEvent = async (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
) => {
  const nftActivities = alchemyWebhookEvent.event.activity;
  const network = alchemyWebhookEvent.event.network;
  const packUpdates = [];
  const packNftWrapper = new PackNftWrapper(
    new ThirdwebSDK(env.CHAIN, { secretKey: env.THIRDWEB_SECRET_KEY }),
  );
  if (!nftActivities?.length) {
    throw new Error('No nft activities found in event');
  }
  for (const activity of nftActivities) {
    const { fromAddress, toAddress, contractAddress, erc1155Metadata } =
      activity;
    const { transactionHash, removed } = activity.log;
    if (removed) {
      console.error(
        `NFT transfer: ${transactionHash} in ${network} for ${contractAddress} collection, fromAddress ${fromAddress} toAddress ${toAddress} with erc1155metadata ${erc1155Metadata} was removed likely due to a reorg`,
      );
    } else {
      if (!erc1155Metadata) {
        console.error(`No erc1155Metadata found for ${transactionHash}`);
      } else
        packUpdates.push(await packNftWrapper.handleErc1155Activity(activity));
    }
  }
  return packUpdates;
};

export async function packNftActivity(req: AlchemyRequest, eventId: string) {
  const alchemyData = await handleAlchemyRequest(req, eventId);

  if (alchemyData instanceof Response) {
    return alchemyData;
  }

  const packUpdates = await extractPackNftUpdatesFromEvent(
    alchemyData.alchemyWebhookEvent,
  );
  if (packUpdates.length) {
    try {
      // take care of the update batch process
    } catch {
      return new Response('Error processing pack updates into hasura', {
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
