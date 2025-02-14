import { adminSdk } from '@gql/admin/api';
import { OrderStatus_Enum } from '@gql/shared/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import { EventPassNftOrder } from './eventPassNftOrder';

jest.mock('@thirdweb-dev/sdk', () => {
  return {
    ThirdwebSDK: {
      fromPrivateKey: jest.fn().mockReturnValue({
        getContract: jest.fn().mockResolvedValue({
          prepare: jest.fn().mockImplementation(() => ({
            encode: jest.fn().mockResolvedValue('mockEncodedValue'),
          })),
          call: jest.fn().mockResolvedValue([]),
        }),
      }),
    },
  };
});

describe('EventPassNftOrder integration test', () => {
  let eventPassNftOrder: EventPassNftOrder;
  let orders;
  let minterWallet;
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'passAmount',
      'passPricing',
      'stripeCheckoutSession',
      'stripeCustomer',
      'order',
      'nftTransfer',
      'eventPassNft',
      'minterTemporaryWallet',
    ]);
  });

  beforeEach(async () => {
    eventPassNftOrder = new EventPassNftOrder();

    const resOrders = await adminSdk.GetOrdersWithClaimInfo({
      ids: ['1e8b9aea-1b0a-4a05-803b-c72d0b46e9a2'],
    });
    orders = resOrders.order;
    const resWallet = await adminSdk.GetMinterTemporaryWalletByEventPassId({
      eventPassId: 'fake-event-pass-2',
    });
    minterWallet = resWallet.minterTemporaryWallet[0];
  });

  afterEach(async () => {
    await deleteAllTables(client);
  });

  afterAll(async () => {
    await client.end();
  });

  it('should successfully execute multicallClaim and update order statuses', async () => {
    await eventPassNftOrder.multicallClaim(minterWallet, orders);

    const updatedOrders = await adminSdk.GetOrdersWithClaimInfo({
      ids: orders.map((order) => order.id),
    });
    updatedOrders.order.forEach((order) => {
      expect(order.status).toBe(OrderStatus_Enum.Completed);
    });
  });

  it('should throw an error when there are no orders', async () => {
    const emptyOrders = [];
    await expect(
      eventPassNftOrder.multicallClaim(minterWallet, emptyOrders),
    ).rejects.toThrow('No orders found or eventPassNftContract is undefined');
  });
});
