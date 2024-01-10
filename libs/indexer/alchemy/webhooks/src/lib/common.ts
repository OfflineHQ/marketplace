import env from '@env/server';
import { PackNftSupply_Updates } from '@gql/shared/types';
import { AlchemyWrapper } from '@indexer/alchemy/admin';
import type { Activity, AlchemyNFTActivityEvent } from '@indexer/alchemy/types';
import { PackNftWrapper } from '@nft/event-pass';
import { type NftTransferWithoutMetadata } from '@nft/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { hexToBigInt } from '@utils';
import { Network } from 'alchemy-sdk';

const alchemy = new AlchemyWrapper();

const handleErc721Activity = async (
  activity: Activity,
  network: Network,
  transactionHash: string,
) => {
  const {
    fromAddress,
    toAddress,
    contractAddress,
    blockNumber,
    erc721TokenId,
  } = activity;

  if (!erc721TokenId) {
    console.error(`No erc721TokenId found for ${transactionHash}`);
    return null;
  }

  return {
    fromAddress,
    toAddress,
    contractAddress,
    blockNumber: hexToBigInt(blockNumber),
    tokenId: hexToBigInt(erc721TokenId),
    chainId: alchemy.convertNetworkToChainId(network).toString(),
    transactionHash,
  };
};

// https://docs.alchemy.com/reference/nft-activity-webhook
const handleActivity = async (activity, network) => {
  const {
    category,
    contractAddress,
    fromAddress,
    toAddress,
    erc721TokenId,
    log: { removed, transactionHash },
  } = activity;
  const packNftWrapper = new PackNftWrapper(
    new ThirdwebSDK(env.CHAIN, { secretKey: env.THIRDWEB_SECRET_KEY }),
  );

  if (removed) {
    console.error(
      `NFT transfer: ${transactionHash} in ${network} for ${contractAddress} collection, fromAddress ${fromAddress} toAddress ${toAddress} with erc721TokenId ${erc721TokenId} was removed likely due to a reorg`,
    );
    return null;
  }

  let transfer;
  let packUpdate;

  if (category === 'erc721') {
    transfer = await handleErc721Activity(activity, network, transactionHash);
    return { transfer, packUpdate };
  } else if (category === 'erc1155') {
    try {
      packUpdate = await packNftWrapper.handleErc1155Activity(
        activity,
        transactionHash,
      );
    } catch (error) {
      console.error(
        `Error handling ERC1155 activity for transaction ${transactionHash}:`,
        error,
      );
      return null;
    }
    return { transfer, packUpdate };
  }
};

export const extractNftTransfersFromEvent = async (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
) => {
  const nftActivities = alchemyWebhookEvent.event.activity;
  const network = alchemyWebhookEvent.event.network;
  const nftTransfers: NftTransferWithoutMetadata[] = [];
  let packUpdates: PackNftSupply_Updates[] = [];

  if (!nftActivities?.length) {
    throw new Error('No nft activities found in event');
  }

  for (const activity of nftActivities) {
    const result = await handleActivity(activity, network);
    if (result) {
      if (result.transfer) {
        nftTransfers.push(result.transfer);
      }
      if (Array.isArray(result.packUpdate)) {
        packUpdates = [...packUpdates, ...result.packUpdate];
      } else if (result.packUpdate) {
        packUpdates.push(result.packUpdate);
      }
    }
  }

  return { nftTransfersFromEvent: nftTransfers, packUpdates };
};
