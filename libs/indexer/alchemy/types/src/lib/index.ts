import { WebhookType, type Network } from 'alchemy-sdk';

export type {
  BaseNft,
  GetAllWebhooksResponse,
  GetBaseNftsForContractOptions,
  GetNftsForContractOptions,
  GetNftsForOwnerOptions,
  GetTransfersForContractOptions,
  Nft,
  NftActivityWebhook,
  NftWebhookParams,
  OwnedNft,
  OwnedNftsResponse,
  TransferredNft,
} from 'alchemy-sdk';

export { WebhookType };

export type AlchemyNetwork = Network;

export interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: WebhookType;
}

export interface AlchemyNFTActivityEvent extends AlchemyWebhookEvent {
  type: WebhookType.NFT_ACTIVITY;
  event: {
    network: AlchemyNetwork;
    activity: Activity[];
  };
}

export interface Activity {
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
