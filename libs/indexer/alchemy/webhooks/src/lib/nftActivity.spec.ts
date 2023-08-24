import { nftActivity, extractNftTransfersFromEvent } from './nftActivity';
import type {
  AlchemyNFTActivityEvent,
  Activity,
  AlchemyRequest,
} from './types';
import { EventPassNftWrapper } from '@nft/eventPass';
import {
  isValidSignatureForAlchemyRequest,
  addAlchemyContextToRequest,
} from './utils';
import { WebhookType, Network } from 'alchemy-sdk';

// Mock implementations
jest.mock('./utils', () => ({
  isValidSignatureForAlchemyRequest: jest.fn().mockReturnValue(true),
  addAlchemyContextToRequest: jest.fn(),
}));

// Spy on the methods
const getEventPassNftTransfersMetadataSpy = jest
  .spyOn(EventPassNftWrapper.prototype, 'getEventPassNftTransfersMetadata')
  .mockResolvedValue([]);

const upsertNftTransfersSpy = jest
  .spyOn(EventPassNftWrapper.prototype, 'upsertNftTransfers')
  .mockResolvedValue([]);

const updateEventPassNftFromNftTransferSpy = jest
  .spyOn(EventPassNftWrapper.prototype, 'updateEventPassNftFromNftTransfer')
  .mockResolvedValue([]);

const applyQrCodeBatchTransferForNewOwnerSpy = jest
  .spyOn(EventPassNftWrapper.prototype, 'applyQrCodeBatchTransferForNewOwner')
  .mockResolvedValue();

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

const mockActivity2: Activity = {
  network: Network.ETH_SEPOLIA,
  fromAddress: 'fromAddress2',
  toAddress: 'toAddress2',
  contractAddress: 'contractAddress2',
  blockNumber: '0x78b78e',
  erc721TokenId: '0x1242141243e',
  hash: 'transactionHash2',
  category: 'erc721',
  log: {
    address: 'address',
    topics: [],
    data: 'data',
    blockNumber: '0x78b78e',
    transactionHash: 'transactionHash2',
    transactionIndex: 'transactionIndex',
    blockHash: 'blockHash',
    logIndex: 'logIndex',
    removed: false,
  },
};

const mockAlchemyNftActivityEvent: AlchemyNFTActivityEvent = {
  webhookId: 'webhookId',
  id: 'id',
  createdAt: new Date(),
  type: WebhookType.NFT_ACTIVITY,
  event: {
    activity: [mockActivity],
  },
};

const mockAlchemyRequest: AlchemyRequest = {
  alchemy: {
    rawBody: JSON.stringify(mockAlchemyNftActivityEvent),
    signature: 'mock-signature',
  },
  text: jest
    .fn()
    .mockResolvedValue(JSON.stringify(mockAlchemyNftActivityEvent)),
  headers: null as unknown as Headers,
  // ... other properties of the AlchemyRequest object if needed
} as unknown as AlchemyRequest; // Cast to AlchemyRequest type

// Create a mock Headers object
const mockHeaders: Headers = {
  get: jest.fn().mockReturnValue('mock-x-alchemy-signature'),
} as unknown as Headers;

// Mock the headers function to return the mock Headers object
jest.mock('next/headers', () => ({
  headers: () => mockHeaders,
}));

describe('extractNftTransfersFromEvent', () => {
  it('should extract one nftTransfer successfully', () => {
    const result = extractNftTransfersFromEvent(mockAlchemyNftActivityEvent);

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
  it('should extract two nftTransfer successfully', () => {
    const mockEvent: AlchemyNFTActivityEvent = {
      ...mockAlchemyNftActivityEvent,
      event: {
        activity: [mockActivity, mockActivity2],
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
      {
        fromAddress: 'fromAddress2',
        toAddress: 'toAddress2',
        contractAddress: 'contractAddress2',
        blockNumber: 7911310n,
        tokenId: 1254688367678n,
        chainId: '11155111',
        transactionHash: 'transactionHash2',
      },
    ]);
  });
  it('should log an error and skip the removed nftTransfer', () => {
    // Mock console.error
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
        activity: [mockActivityWithRemoved, mockActivity2],
      },
    };

    const result = extractNftTransfersFromEvent(mockEvent);

    expect(result).toEqual([
      {
        fromAddress: 'fromAddress2',
        toAddress: 'toAddress2',
        contractAddress: 'contractAddress2',
        blockNumber: 7911310n,
        tokenId: 1254688367678n,
        chainId: '11155111',
        transactionHash: 'transactionHash2',
      },
    ]);

    // Check that console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error when nftActivities is empty', () => {
    const mockEventWithoutActivities: AlchemyNFTActivityEvent = {
      webhookId: 'webhookId',
      id: 'id',
      createdAt: new Date(),
      type: WebhookType.NFT_ACTIVITY,
      event: {
        activity: [], // Empty activity array
      },
    };

    expect(() =>
      extractNftTransfersFromEvent(mockEventWithoutActivities)
    ).toThrow('No nft activities found in event');
  });
});

describe('nftActivity', () => {
  it('happy path with several nft activity being processed', async () => {
    const response = await nftActivity(mockAlchemyRequest, 'fake-event-1');
    expect(response.status).toEqual(200);
    expect(isValidSignatureForAlchemyRequest).toHaveBeenCalled();
    // Expect calls to EventPassNftWrapper methods
    expect(getEventPassNftTransfersMetadataSpy).toHaveBeenCalled();
    expect(upsertNftTransfersSpy).toHaveBeenCalled();
    expect(updateEventPassNftFromNftTransferSpy).toHaveBeenCalled();
    expect(applyQrCodeBatchTransferForNewOwnerSpy).toHaveBeenCalled();
  });
  it('should return error 403 from invalid signature', async () => {
    // Override the validation to return false
    (isValidSignatureForAlchemyRequest as jest.Mock).mockReturnValueOnce(false);

    const response = await nftActivity(mockAlchemyRequest, 'fake-event-1');

    expect(response.status).toEqual(403);
  });

  it('should return error 500 from eventPassNftWrapper', async () => {
    // Force an error in one of the EventPassNftWrapper methods
    getEventPassNftTransfersMetadataSpy.mockRejectedValue(
      new Error('Test error')
    );

    const response = await nftActivity(mockAlchemyRequest, 'fake-event-1');

    expect(response.status).toEqual(500);
  });

  // it('should return error 500 when nftTransfersFromEvent.length is empty', async () => {
  //   // Override extractNftTransfersFromEvent to return an empty array
  //   jest.spyOn(module, 'extractNftTransfersFromEvent').mockReturnValue([]);

  //   const response = await nftActivity(mockAlchemyRequest, 'fake-event-1');

  //   expect(response.status).toEqual(500);
  //   expect(response.statusText).toEqual('No nft transfers found in event');
  // });

  it('should return error 400 for incorrect webhook type', async () => {
    const invalidWebhookEvent = {
      ...mockAlchemyNftActivityEvent,
      type: WebhookType.NFT_METADATA_UPDATE, // Invalid type
    };

    mockAlchemyRequest.text = jest
      .fn()
      .mockResolvedValueOnce(JSON.stringify(invalidWebhookEvent));

    const response = await nftActivity(mockAlchemyRequest, 'fake-event-1');

    expect(response.status).toEqual(400);
  });
});
