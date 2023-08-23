import { extractNftTransfersFromEvent } from './nftActivity';
import type { AlchemyNFTActivityEvent, Activity } from './types';
import { WebhookType, Network } from 'alchemy-sdk';

describe('extractNftTransfersFromEvent', () => {
  const mockActivity: Activity = {
    network: Network.ETH_SEPOLIA,
    fromAddress: 'fromAddress',
    toAddress: 'toAddress',
    contractAddress: 'contractAddress',
    blockNumber: '0x78b94e',
    erc721TokenId:
      '0x2acc2dff0c1fa9c1c62f518c9415a0ca60e03f77000000000000010000000001',
    hash: 'transactionHash',
    category: 'erc721',
    log: {
      address: 'address',
      topics: [],
      data: 'data',
      blockNumber: '0x78b94e',
      transactionHash: 'transactionHash',
      transactionIndex: 'transactionIndex',
      blockHash: 'blockHash',
      logIndex: 'logIndex',
      removed: false,
    },
  };

  it('should extract one nftTransfer successfully', () => {
    const mockEvent: AlchemyNFTActivityEvent = {
      webhookId: 'webhookId',
      id: 'id',
      createdAt: new Date(),
      type: WebhookType.NFT_ACTIVITY,
      event: {
        activity: [mockActivity],
      },
    };

    const result = extractNftTransfersFromEvent(mockEvent);

    expect(result).toEqual([
      {
        fromAddress: 'fromAddress',
        toAddress: 'toAddress',
        contractAddress: 'contractAddress',
        blockNumber: 7911758n,
        tokenId:
          19357893896360757362909707998697759599119570929526790658166113146556033007617n,
        chainId: '11155111',
        transactionHash: 'transactionHash',
      },
    ]);
  });
});
