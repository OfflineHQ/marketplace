import env from '@env/server';
import { FileWrapper } from '@file-upload/admin';
import type { Activity } from '@indexer/alchemy/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { eventPassActivity } from './eventPassActivity';
import { createMockAlchemyRequest } from './testUtils';

// Mock the FileWrapper module
jest.mock('@file-upload/admin');
jest.mock('./utils', () => {
  const originalModule = jest.requireActual('./utils');

  return {
    ...originalModule,
    isValidSignatureForAlchemyRequest: jest.fn().mockReturnValue(true),
    addAlchemyContextToRequest: jest.fn(),
  };
});

// Specific mock data for each test case
const mockActivity = {
  fromAddress: '0x1bbedb07706728a19c9db82d3c420670d8040592', // from account seed
  toAddress: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d', // to account seed
  contractAddress: '0xfakecontractaddress1', // from eventPassNftContract seed
  blockNum: '0x78b94e',
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
  erc721TokenId: '0x12D4CC', // from eventPassNft seed '1234124' in decimal
} satisfies Activity;

const mockActivity2 = {
  fromAddress: '0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f', // from account seed
  toAddress: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d', // to account seed
  contractAddress: '0xfakecontractaddress1', // from eventPassNftContract seed
  blockNum: '0x78b78e',
  hash: 'transactionHash',
  category: 'erc721',
  log: {
    address: 'address',
    topics: [],
    data: 'data',
    blockNumber: '0x78b78e',
    transactionHash: 'transactionHash',
    transactionIndex: 'transactionIndex',
    blockHash: 'blockHash',
    logIndex: 'logIndex',
    removed: false,
  },
  erc721TokenId: '0x3090', // from eventPassNft seed `12432` in decimal
} satisfies Activity;

const mockActivity3 = {
  fromAddress: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
  toAddress: '0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f',
  contractAddress: '0xfakecontractaddress2',
  blockNum: '0x78b78124214',
  hash: 'transactionHash',
  category: 'erc721',
  log: {
    address: 'address',
    topics: [],
    data: 'data',
    blockNumber: '0x78b78124214',
    transactionHash: 'transactionHash',
    transactionIndex: 'transactionIndex',
    blockHash: 'blockHash',
    logIndex: 'logIndex',
    removed: false,
  },
  erc721TokenId: '0x5A271C00', // from eventPassNft seed `1512512512` in decimal
} satisfies Activity;

const mockActivity4NoNft = {
  ...mockActivity3,
  contractAddress: '0xfakecontractaddress3',
} satisfies Activity;

// ... add more mock data as needed

// Create a mock Headers object
const mockHeaders: Headers = {
  get: jest.fn().mockReturnValue('mock-x-alchemy-signature'),
} as unknown as Headers;

// Mock the headers function to return the mock Headers object
jest.mock('next/headers', () => ({
  headers: () => mockHeaders,
}));

describe('eventPassActivity integration test', () => {
  let client: PgClient;
  let fileWrapper: FileWrapper;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'nftTransfer',
      'eventPassNft',
    ]);
    fileWrapper = new FileWrapper();

    // Provide mock implementations
    (fileWrapper.copyFileBatchWithRetry as jest.Mock).mockImplementation(() =>
      Promise.resolve(),
    );
    (fileWrapper.deleteFilesBatchWithRetry as jest.Mock).mockImplementation(
      () => Promise.resolve(),
    );
  });
  afterEach(async () => {
    // jest.resetAllMocks();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'nftTransfer',
      'eventPassNft',
    ]);
  });
  afterAll(async () => {
    await client.end();
  });

  it('happy path with several nft activity being processed - no need to transfer QR code file', async () => {
    const response = await eventPassActivity(
      createMockAlchemyRequest([mockActivity]),
      'clizzpvidao620buvxit1ynko',
    );

    expect(response.status).toEqual(200);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock,
    ).not.toHaveBeenCalled();
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock,
    ).not.toHaveBeenCalled();
  });

  it('happy path with several nft activity being processed - transfer of QR code file', async () => {
    const response = await eventPassActivity(
      createMockAlchemyRequest([mockActivity, mockActivity2]),
      'clizzpvidao620buvxit1ynko',
    );

    expect(response.status).toEqual(200);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledWith(env.BYTESCALE_ACCOUNT_ID, [
      {
        source: `/${env.UPLOAD_PATH_PREFIX}/users/0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png`,
        destination: `/${env.UPLOAD_PATH_PREFIX}/users/0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png`,
      },
    ]);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledWith(env.BYTESCALE_ACCOUNT_ID, [
      `/${env.UPLOAD_PATH_PREFIX}/users/0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png`,
    ]);
  });

  it('happy path with several nft activity being processed - from different contractAddress', async () => {
    const response = await eventPassActivity(
      createMockAlchemyRequest([mockActivity, mockActivity2, mockActivity3]),
      'clizzpvidao620buvxit1ynko',
    );

    expect(response.status).toEqual(200);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledTimes(2);
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledWith(env.BYTESCALE_ACCOUNT_ID, [
      {
        source: `/${env.UPLOAD_PATH_PREFIX}/users/0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png`,
        destination: `/${env.UPLOAD_PATH_PREFIX}/users/0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png`,
      },
      {
        destination: `/${env.UPLOAD_PATH_PREFIX}/users/0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/fake-event-pass-2/clizzpvidao620buvxit1ynko-fake-event-pass-2-1512512512.png`,
        source: `/${env.UPLOAD_PATH_PREFIX}/users/0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/fake-event-pass-2/clizzpvidao620buvxit1ynko-fake-event-pass-2-1512512512.png`,
      },
    ]);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledTimes(2);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock,
    ).toHaveBeenCalledWith(env.BYTESCALE_ACCOUNT_ID, [
      `/${env.UPLOAD_PATH_PREFIX}/users/0x1b8bd7c7f656290071e52d1aa617d9cb4469bb9f/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432.png`,
      `/${env.UPLOAD_PATH_PREFIX}/users/0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/fake-event-pass-2/clizzpvidao620buvxit1ynko-fake-event-pass-2-1512512512.png`,
    ]);
  });

  it('should log errors in case one NFT not found in DB', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const response = await eventPassActivity(
      createMockAlchemyRequest([mockActivity, mockActivity4NoNft]),
      'clizzpvidao620buvxit1ynko',
    );
    expect(response.status).toEqual(200);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(mockActivity4NoNft.contractAddress),
    );
    consoleSpy.mockRestore();
  });

  it('should return error in case no NFT found in DB', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const response = await eventPassActivity(
      createMockAlchemyRequest([mockActivity4NoNft]),
      'clizzpvidao620buvxit1ynko',
    );
    expect(response.status).toEqual(500);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(mockActivity4NoNft.contractAddress),
    );
    consoleSpy.mockRestore();
  });

  // ... add more test cases as needed
});
