import { WebhookType } from 'alchemy-sdk';
import type { NftTransfer } from '@gql/shared/types';

export interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: WebhookType;
}

export interface AlchemyNFTActivityEvent extends AlchemyWebhookEvent {
  type: WebhookType.NFT_ACTIVITY;
  event: {
    activity: Activity[];
  };
}

interface Activity {
  network: string;
  fromAddress: string;
  toAddress: string;
  contractAddress: string;
  blockNumber: string;
  hash: string;
  erc1155Metadata?: ERC1155Metadata[];
  category: 'erc1155' | 'erc721';
  log: Log;
  erc721TokenId?: string;
}

interface ERC1155Metadata {
  tokenId: string;
  value: string;
}

interface Log {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  logIndex: string;
  removed: boolean;
}

export interface AlchemyRequest extends Request {
  alchemy: {
    rawBody: string;
    signature: string;
  };
}

export type NftTransferNotCreated = Omit<NftTransfer, 'id' | 'created_at'>;

export type NftTransferWithoutMetadata = Omit<
  NftTransferNotCreated,
  'eventId' | 'organizerId' | 'eventPassId'
>;
