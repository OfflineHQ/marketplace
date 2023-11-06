import { Stage } from '@gql/shared/types';
import {
  applySeeds,
  createDbClient,
  deleteTables,
  type PgClient,
} from '@test-utils/db';
import { alphaUserClient } from '@test-utils/gql';

describe('tests for eventPassOrder user', () => {
  let client: PgClient;

  const alphaUser = alphaUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, [
      'account',
      'eventPassOrder',
      'eventPassPricing',
    ]);
    await applySeeds(client, ['account', 'eventPassPricing']);
  });

  beforeEach(async () => {
    await applySeeds(client, ['eventPassOrder']);
  });

  afterAll(async () => {
    await deleteTables(client, [
      'account',
      'eventPassOrder',
      'eventPassPricing',
    ]);
    await client.end();
  });
  afterEach(async () => {
    await deleteTables(client, ['eventPassOrder']);
  });

  it('should get confirmed eventPassOrders', async () => {
    const res = await alphaUser.GetEventPassOrdersConfirmed();
    const orders = res.eventPassOrder;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });

  it('should get eventPassOrders with IS_MINTING status', async () => {
    const res = await alphaUser.GetEventPassOrdersIsMinting();
    const orders = res.eventPassOrder;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(2);
  });

  it('should get eventPassOrders from ids', async () => {
    const res = await alphaUser.GetEventPassOrdersFromIds({
      eventPassOrderIds: ['1e8b9aea-1b0a-4a05-803b-c72d0b46e9a2'],
      stage: Stage.Draft,
    });
    const orders = res.eventPassOrder;
    expect(orders.length).toBe(1);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });

  it('should get eventPassOrder purchased for eventPassesId', async () => {
    const res = await alphaUser.GetEventPassOrderPurchasedForEventPassesId({
      eventPassId: 'fake-event-pass-2',
    });
    const orders = res.eventPassOrder;
    expect(orders.length).toBe(2);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });

  it('should get eventPassOrder purchased for eventPassesIds', async () => {
    const res = await alphaUser.GetEventPassOrderPurchasedForEventPassesIds({
      eventPassIds: ['fake-event-pass-2'],
    });
    const orders = res.eventPassOrder;
    expect(orders.length).toBe(2);
    expect(orders[0].eventPassId).toBe('fake-event-pass-2');
    expect(orders[0].quantity).toBe(8);
  });
});
