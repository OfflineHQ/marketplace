import {
  createDbClient,
  deleteTables,
  type PgClient,
  deleteAllTables,
  applySeeds,
} from '@test-utils/db';
import { nftActivity } from './nftActivity';
import { createMockAlchemyRequest } from './testUtils';
import { FileWrapper } from '@file-upload/admin';
import { WebhookType, Network } from 'alchemy-sdk';
import type { Activity } from './types';

// Mock the FileWrapper module
jest.mock('@file-upload/admin');
jest.mock('./utils', () => ({
  isValidSignatureForAlchemyRequest: jest.fn().mockReturnValue(true),
  addAlchemyContextToRequest: jest.fn(),
}));

// Specific mock data for each test case
const mockActivity = {
  network: Network.ETH_SEPOLIA,
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
  network: Network.ETH_SEPOLIA,
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

  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  it('happy path with several nft activity being processed - no need to transfer QR code file', async () => {
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity]),
      'fake-event-1'
    );

    // Assert that the response is correct
    expect(response.status).toEqual(200);

    // Assert that the methods were not called
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).not.toHaveBeenCalled();
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).not.toHaveBeenCalled();
  });

  it('happy path with several nft activity being processed - transfer of QR code file', async () => {
    const response = await nftActivity(
      createMockAlchemyRequest([mockActivity2]),
      'fake-event-1'
    );

    // Assert that the response is correct
    expect(response.status).toEqual(200);

    // Assert that the methods were called
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
    expect(
      FileWrapper.prototype.copyFileBatchWithRetry as jest.Mock
    ).toHaveBeenCalledWith(process.env.UPLOAD_ACCOUNT_ID as string, [
      {
        source:
          '/local/users/0x1B8bD7C7f656290071E52D1aA617D9cB4469BB9F/fake-organizer-1/events/fake-event-1/fake-event-pass-1/fake-event-1-fake-event-pass-1-12432',
        destination:
          '/local/users/0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D/fake-organizer-1/events/fake-event-1/fake-event-pass-1/fake-event-1-fake-event-pass-1-12432',
      },
    ]);
    expect(
      FileWrapper.prototype.deleteFilesBatchWithRetry as jest.Mock
    ).toHaveBeenCalledTimes(1);
  });

  // ... add more test cases as needed
});
