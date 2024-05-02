import { EventPassNftOrder } from '@nft/thirdweb-admin';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { kv } from '@vercel/kv';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from './index';

jest.mock('@nft/thirdweb-admin', () => ({
  EventPassNftOrder: jest.fn().mockImplementation(() => ({
    multicallClaim: jest.fn().mockResolvedValueOnce({ success: true }),
  })),
}));

describe('Orders Claim API', () => {
  let client: PgClient;
  let consoleSpy: jest.SpyInstance;

  beforeAll(async () => {
    client = await createDbClient();
    await applySeeds(client, [
      'account',
      'kyc',
      'passAmount',
      'passPricing',
      'eventPassNftContract',
      'nftTransfer',
      'eventPassNft',
      'eventParameters',
      'stripeCustomer',
      'stripeCheckoutSession',
      'order',
      'minterTemporaryWallet',
    ]);
  });

  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  test('returns 405 for non-POST requests', async () => {
    const mockReq = { method: 'GET' } as any;
    const mockRes = { status: jest.fn(() => mockRes), json: jest.fn() } as any;
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
  });

  test('returns 400 when orderIds or eventPassId are missing', async () => {
    const mockReq = { method: 'POST', body: {} } as any; // Empty body to trigger error
    const mockRes = { status: jest.fn(() => mockRes), json: jest.fn() } as any;
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'No order IDs provided',
    });
  });

  test('multicallClaim is called with correct arguments', async () => {
    const mockReq = {
      method: 'POST',
      body: {
        orderIds: [
          '2e8b9aea-1b0a-4a05-803b-c72d0b46e9a3',
          '2e8b9aea-1b0a-4a05-803b-c72d0b46e9a4',
          '2e8b9aea-1b0a-4a05-803b-c72d0b46e9a5',
        ],
        eventPassId: 'fake-event-pass-3',
      },
    } as NextApiRequest;
    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    } as any as NextApiResponse;

    await handler(mockReq, mockRes);

    const multicallClaimMock =
      EventPassNftOrder.mock.results[0].value.multicallClaim;

    expect(multicallClaimMock).toHaveBeenCalled();

    expect(multicallClaimMock).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0xtestwalletaddress11',
        privateKey: 'TestPrivateKey11',
        eventPassId: 'fake-event-pass-3',
      }),
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          eventPassId: 'fake-event-pass-3',
          packId: null,
          quantity: 2,
          status: 'IS_MINTING',
          eventPassNftContract: null,
          packNftContract: null,
          account: expect.objectContaining({
            address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
          }),
        }),
      ]),
    );
  });

  test('handler returns 200 when wallet is busy', async () => {
    const mockReq = {
      method: 'POST',
      body: {
        orderIds: [
          '2e8b9aea-1b0a-4a05-803b-c72d0b46e9a3',
          '2e8b9aea-1b0a-4a05-803b-c72d0b46e9a4',
          '2e8b9aea-1b0a-4a05-803b-c72d0b46e9a5',
        ],
        eventPassId: 'fake-event-pass-3',
      },
    } as NextApiRequest;
    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    } as any as NextApiResponse;

    await kv.set('0xtestwalletaddress11', 'busy');

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Wallet 0xtestwalletaddress11 for eventPassId fake-event-pass-3 is busy',
      ),
    );
    await kv.del('0xtestwalletaddress11');
  });
});
