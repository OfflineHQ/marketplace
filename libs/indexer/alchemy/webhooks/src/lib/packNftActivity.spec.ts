// eventPassNftActivity.spec.ts
import { Activity, AlchemyNFTActivityEvent } from '@indexer/alchemy/types';
import { Network, WebhookType } from 'alchemy-sdk';
import { extractPackNftUpdatesFromEvent } from './packNftActivity';

const mockActivity: Activity = {
  fromAddress: 'fromAddress',
  toAddress: 'toAddress',
  contractAddress: 'contractAddress',
  blockNumber: '0x78b94e',
  erc1155Metadata: [
    {
      tokenId: '0',
      value: '23',
    },
  ],
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

describe('extractPackNftUpdatesFromEvent', () => {
  it('should throw an error when nftActivities is empty', async () => {
    const mockEventWithoutActivities: AlchemyNFTActivityEvent = {
      webhookId: 'webhookId',
      id: 'id',
      createdAt: new Date(),
      type: WebhookType.NFT_ACTIVITY,
      event: {
        network: Network.ETH_GOERLI,
        activity: [],
      },
    };

    await expect(
      extractPackNftUpdatesFromEvent(mockEventWithoutActivities),
    ).rejects.toThrow('No nft activities found in event');
  });

  it('should log an error and skip the removed nftTransfer', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockActivityWithRemoved = {
      ...mockActivity,
      log: { ...mockActivity.log, removed: true },
    };

    const mockEvent: AlchemyNFTActivityEvent = {
      webhookId: 'webhookId',
      id: 'id',
      createdAt: new Date(),
      type: WebhookType.NFT_ACTIVITY,
      event: {
        network: Network.ETH_GOERLI,
        activity: [mockActivityWithRemoved],
      },
    };

    const result = await extractPackNftUpdatesFromEvent(mockEvent);

    expect(result).toEqual([]);

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should log an error when erc1155Metadata is missing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockActivityWithoutErc1155Metadata = {
      ...mockActivity,
      erc1155Metadata: null,
    };

    const mockEvent: AlchemyNFTActivityEvent = {
      webhookId: 'webhookId',
      id: 'id',
      createdAt: new Date(),
      type: WebhookType.NFT_ACTIVITY,
      event: {
        network: Network.ETH_GOERLI,
        activity: [mockActivityWithoutErc1155Metadata],
      },
    };

    const result = await extractPackNftUpdatesFromEvent(mockEvent);

    expect(result).toEqual([]);

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
