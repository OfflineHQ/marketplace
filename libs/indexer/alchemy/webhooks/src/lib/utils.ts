import { isValidSignature } from '@crypto';
import type { AlchemyRequest } from '@indexer/alchemy/types';
import { AlchemyNFTActivityEvent } from '@indexer/alchemy/types';
import { hexToBigInt } from '@utils';

export interface ProcessedActivity {
  fromAddress: string;
  toAddress: string;
  contractAddress: string;
  tokenId: bigint;
  transactionHash: string;
  removed: boolean;
  blockNum: bigint;
}

export const processNftActivities = (
  alchemyWebhookEvent: AlchemyNFTActivityEvent,
): ProcessedActivity[] => {
  const nftActivities = alchemyWebhookEvent.event.activity;
  if (!nftActivities?.length) {
    throw new Error('No nft activities found in event');
  }

  return nftActivities
    .map((activity) => {
      const {
        fromAddress,
        toAddress,
        contractAddress,
        erc721TokenId,
        log,
        blockNum,
      } = activity;
      const { transactionHash, removed } = log;

      if (removed || !erc721TokenId) {
        const errorMessage = removed
          ? `Activity removed: ${transactionHash} likely due to a reorg`
          : `No erc721TokenId found for ${transactionHash}`;
        console.error(errorMessage);
        return null;
      }

      return {
        fromAddress,
        toAddress,
        contractAddress,
        tokenId: hexToBigInt(erc721TokenId),
        transactionHash,
        blockNum: hexToBigInt(blockNum),
        removed,
      };
    })
    .filter((activity) => activity !== null);
};

export function isValidSignatureForAlchemyRequest(
  request: AlchemyRequest,
  activityWebhookSigningKey: string,
): boolean {
  return isValidSignatureForStringBody(
    request.alchemy.rawBody,
    request.alchemy.signature,
    activityWebhookSigningKey,
  );
}

export function isValidSignatureForStringBody(
  body: string,
  signature: string,
  activityWebhookSigningKey: string,
): boolean {
  return isValidSignature({
    body,
    secret: activityWebhookSigningKey,
    signature,
  });
}

export function addAlchemyContextToRequest(
  req: AlchemyRequest,
  body: string,
  signature: string,
): void {
  req.alchemy = {
    rawBody: body,
    signature,
  };
}
