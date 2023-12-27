import { Stage } from '@gql/shared/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  deleteTables,
  type PgClient,
} from '@test-utils/db';
import { alphaUserClient } from '@test-utils/gql';

describe('tests for order user', () => {
  let client: PgClient;

  const alphaUser = alphaUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, ['account', 'passPricing', 'passAmount']);
  });

  beforeEach(async () => {
    await applySeeds(client, ['order']);
  });

  afterAll(async () => {
    await deleteTables(client, [
      'account',
      'order',
      'passPricing',
      'passAmount',
    ]);
    await client.end();
  });
  afterEach(async () => {
    await deleteTables(client, ['order']);
  });

  it('should get confirmed orders', async () => {
    const res = await alphaUser.GetOrdersConfirmed();
    const orders = res.order;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });

  it('should get orders with IS_MINTING status', async () => {
    const res = await alphaUser.GetOrdersIsMinting();
    const orders = res.order;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-3');
    expect(orders[0].quantity).toBe(2);
  });

  it('should get orders from ids', async () => {
    const res = await alphaUser.GetOrdersFromIds({
      orderIds: ['1e8b9aea-1b0a-4a05-803b-c72d0b46e9a2'],
      stage: Stage.Draft,
    });
    const orders = res.order;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });

  it('should get order purchased for eventPassesId', async () => {
    const res = await alphaUser.GetOrderPurchasedForEventPassesId({
      eventPassId: 'fake-event-pass-2',
    });
    const orders = res.order;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });

  it('should get order purchased for eventPassesIds', async () => {
    const res = await alphaUser.GetOrderPurchasedForEventPassesIds({
      eventPassIds: ['fake-event-pass-2'],
    });
    const orders = res.order;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });
});
