import type { Activity } from '@indexer/alchemy/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { loyaltyCardActivity } from './loyaltyCardActivity';
import { createMockAlchemyRequest } from './testUtils';

jest.mock('./utils', () => {
  const originalModule = jest.requireActual('./utils');

  return {
    ...originalModule,
    isValidSignatureForAlchemyRequest: jest.fn().mockReturnValue(true),
    addAlchemyContextToRequest: jest.fn(),
  };
});

const mockActivity = {
  fromAddress: '0x1bbedb07706728a19c9db82d3c420670d8040592',
  toAddress: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
  contractAddress: '0xloyaltycardactivitycontractaddress',
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
  erc721TokenId: '0x1',
} satisfies Activity;

const mockActivity2 = {
  fromAddress: '0xNewFromAddress1',
  toAddress: '0x987654321',
  contractAddress: '0xnewcontractaddress1',
  blockNum: '0x78b94f',
  hash: 'newTransactionHash1',
  category: 'erc721',
  log: {
    address: 'address',
    topics: [],
    data: 'data',
    blockNumber: '0x78b94f',
    transactionHash: 'newTransactionHash1',
    transactionIndex: 'transactionIndex',
    blockHash: 'blockHash',
    logIndex: 'logIndex',
    removed: false,
  },
  erc721TokenId: '0x3',
} satisfies Activity;

const mockActivity3 = {
  fromAddress: '0xNewFromAddress1',
  toAddress: '0x123456789',
  contractAddress: '0xnewcontractaddress2',
  blockNum: '0x78b950',
  hash: 'newTransactionHash2',
  category: 'erc721',
  log: {
    address: 'address',
    topics: [],
    data: 'data',
    blockNumber: '0x78b950',
    transactionHash: 'newTransactionHash2',
    transactionIndex: 'transactionIndex',
    blockHash: 'blockHash',
    logIndex: 'logIndex',
    removed: false,
  },
  erc721TokenId: '0x4',
} satisfies Activity;

const mockActivity4NoNft = {
  ...mockActivity2,
  contractAddress: '0xnonexistingaddress',
} satisfies Activity;

const mockHeaders: Headers = {
  get: jest.fn().mockReturnValue('mock-x-alchemy-signature'),
} as unknown as Headers;

jest.mock('next/headers', () => ({
  headers: () => mockHeaders,
}));

describe('loyaltyCardActivity integration test', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'loyaltyCardNftContract',
      'loyaltyCardParameters',
      'loyaltyCardNft',
    ]);
  });
  afterEach(async () => {
    await deleteAllTables(client);
    await applySeeds(client, [
      'loyaltyCardNftContract',
      'loyaltyCardParameters',
      'loyaltyCardNft',
    ]);
  });
  afterAll(async () => {
    await client.end();
  });

  it('happy path with one nft', async () => {
    const response = await loyaltyCardActivity(
      createMockAlchemyRequest([mockActivity]),
      'test-loyalty-card-activity',
    );

    expect(response.status).toEqual(200);

    const sql = `SELECT * FROM public."loyaltyCardNft" 
    WHERE "contractAddress" = '${mockActivity.contractAddress}' 
    AND "tokenId" = ${mockActivity.erc721TokenId.toString()};`;

    const nft = (await client.query(sql)).rows[0];
    expect(nft.ownerAddress).toEqual(mockActivity.toAddress);
  });

  it('happy path with several nfts', async () => {
    const response = await loyaltyCardActivity(
      createMockAlchemyRequest([mockActivity, mockActivity2, mockActivity3]),
      'test-loyalty-card-activity',
    );

    expect(response.status).toEqual(200);

    const activities = [mockActivity, mockActivity2, mockActivity3];
    for (const activity of activities) {
      const sql = `SELECT * FROM public."loyaltyCardNft" 
      WHERE "contractAddress" = '${activity.contractAddress}' 
      AND "tokenId" = ${activity.erc721TokenId.toString()};`;

      const nft = (await client.query(sql)).rows[0];
      expect(nft.ownerAddress).toEqual(activity.toAddress);
    }
  });

  it("happy path with several nfts and one that doesn't exist", async () => {
    const response = await loyaltyCardActivity(
      createMockAlchemyRequest([
        mockActivity,
        mockActivity2,
        mockActivity3,
        mockActivity4NoNft,
      ]),
      'test-loyalty-card-activity',
    );

    expect(response.status).toEqual(200);

    const activities = [mockActivity, mockActivity2, mockActivity3];
    for (const activity of activities) {
      const sql = `SELECT * FROM public."loyaltyCardNft" 
      WHERE "contractAddress" = '${activity.contractAddress}' 
      AND "tokenId" = ${activity.erc721TokenId.toString()};`;

      const nft = (await client.query(sql)).rows[0];
      expect(nft.ownerAddress).toEqual(activity.toAddress);
    }
  });

  it('bad path with non existing nft', async () => {
    const response = await loyaltyCardActivity(
      createMockAlchemyRequest([mockActivity4NoNft]),
      'test-loyalty-card-activity',
    );

    expect(response.status).toEqual(500);
    const responseBody = await response.text();
    expect(responseBody).toEqual('No loyalty cards mint found in event');
  });
});
