import { WebhookType } from 'alchemy-sdk';

export interface AlchemyNFTActivityEvent {
  webhookId: string;
  id: string;
  createdAt: string;
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
  blockNum: string;
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

export interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: WebhookType;
  event: Record<any, any>;
}
