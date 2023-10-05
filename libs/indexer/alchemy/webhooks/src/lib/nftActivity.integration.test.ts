import { FileWrapper } from '@file-upload/admin';
import type { Activity } from '@indexer/alchemy/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { Network } from 'alchemy-sdk';
import { nftActivity } from './nftActivity';
import { createMockAlchemyRequest } from './testUtils';
import env from '@env/server';

// Mock the FileWrapper module
jest.mock('@file-upload/admin');
jest.mock('./utils', () => ({
  isValidSignatureForAlchemyRequest: jest.fn().mockReturnValue(true),
  addAlchemyContextToRequest: jest.fn(),
}));

// Specific mock data for each test case
const mockActivity = {
  network: Network.ETH_GOERLI,
  fromAddress: '0x1bBEdB07706728A19c9dB82d3c420670D8040592', // from account seed
  toAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D', // to account seed
  contractAddress: '0xfakecontractaddress1', // from eventPassNftContract seed
  blockNumber: '0x78b94e',
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
  network: Network.ETH_GOERLI,
  fromAddress: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F', // from account seed
  toAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D', // to account seed
  contractAddress: '0xfakecontractaddress1', // from eventPassNftContract seed
  blockNumber: '0x78b78e',
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
  network: Network.ETH_GOERLI,
  fromAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
  toAddress: '0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F',
  contractAddress: '0xfakecontractaddress2',
  blockNumber: '0x78b78124214',
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

describe('nftActivity integration test', () => {
  let client: PgClient;
  let fileWrapper: FileWrapper;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'eventPassNft',
    ]);
    fileWrapper = new FileWrapper();

    // Provide mock implementations
    (fileWrapper.copyFileBatchWithRetry as jest.Mock).mockImplementation(() =>
      Promise.resolve()
    );
    (fileWrapper.deleteFilesBatchWithRetry as jest.Mock).mockImplementation(
      () => Promise.resolve()
    );
  });
  afterEach(async () => {
    // jest.resetAllMocks();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'eventPassNft',
    ]);
  });
  afterAll(async () => {
    await client.end();
  });

  it('happy path with several nft activity being processed - no need to transfer QR code file', async () => {
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity]),
      'clizzpvidao620buvxit1ynko'
    );

    expect(response.status).toEqual(200);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).not.toHaveBeenCalled();
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).not.toHaveBeenCalled();
  });

  it('happy path with several nft activity being processed - transfer of QR code file', async () => {
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity, mockActivity2]),
      'clizzpvidao620buvxit1ynko'
    );

    expect(response.status).toEqual(200);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(env.UPLOAD_ACCOUNT_ID, [
      {
        source:
          '/local/users/0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432',
        destination:
          '/local/users/0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432',
      },
    ]);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(env.UPLOAD_ACCOUNT_ID, [
      '/local/users/0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432',
    ]);
  });

  it('happy path with several nft activity being processed - from different contractAddress', async () => {
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity, mockActivity2, mockActivity3]),
      'clizzpvidao620buvxit1ynko'
    );

    expect(response.status).toEqual(200);

    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(2);
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(env.UPLOAD_ACCOUNT_ID, [
      {
        source:
          '/local/users/0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432',
        destination:
          '/local/users/0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432',
      },
      {
        destination:
          '/local/users/0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/fake-event-pass-2/clizzpvidao620buvxit1ynko-fake-event-pass-2-1512512512',
        source:
          '/local/users/0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/fake-event-pass-2/clizzpvidao620buvxit1ynko-fake-event-pass-2-1512512512',
      },
    ]);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(2);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(env.UPLOAD_ACCOUNT_ID, [
      '/local/users/0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/clj8raobj7g8l0aw3bfw6dny4/clizzpvidao620buvxit1ynko-clj8raobj7g8l0aw3bfw6dny4-12432',
      '/local/users/0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D/clizzky8kap2t0bw7wka9a2id/events/clizzpvidao620buvxit1ynko/fake-event-pass-2/clizzpvidao620buvxit1ynko-fake-event-pass-2-1512512512',
    ]);
  });

  it('should log errors in case one NFT not found in DB', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity, mockActivity4NoNft]),
      'clizzpvidao620buvxit1ynko'
    );
    expect(response.status).toEqual(200);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(mockActivity4NoNft.contractAddress)
    );
    consoleSpy.mockRestore();
  });

  it('should return error in case no NFT found in DB', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity4NoNft]),
      'clizzpvidao620buvxit1ynko'
    );
    expect(response.status).toEqual(500);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(mockActivity4NoNft.contractAddress)
    );
    consoleSpy.mockRestore();
  });

  // ... add more test cases as needed
});
