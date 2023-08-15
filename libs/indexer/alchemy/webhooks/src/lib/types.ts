import { WebhookType } from 'alchemy-sdk';

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

export interface NftTransfer
  extends Pick<
    Activity,
    | 'fromAddress'
    | 'toAddress'
    | 'contractAddress'
    | 'erc721TokenId'
    | 'blockNumber'
  > {
  eventId: string;
  organizerId: string;
  eventPassId: string;
  transactionHash: string;
  chainId: string;
}
