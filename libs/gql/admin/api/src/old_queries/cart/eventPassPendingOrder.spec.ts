import {
  seedDb,
  createDbClient,
  deleteTables,
  type PgClient,
  applySeeds,
} from '@test-utils/db';
import { adminSdk } from '../../generated';

describe('tests for eventPassPendingOrder admin', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, ['account']);
    await seedDb(client, 'account');
  });
  afterAll(async () => {
    await deleteTables(client, [
      'account',
      'eventPassPendingOrder',
      'eventPassPricing',
    ]);
    await client.end();
  });
  beforeEach(async () => {
    await deleteTables(client, ['eventPassPendingOrder', 'eventPassPricing']);
    await applySeeds(client, ['eventPassPricing', 'eventPassPendingOrder']);
  });

  it('should retrieve all existing eventPassPendingOrder', async () => {
    const res = await adminSdk.GetEventPassPendingOrders();
    const orders = res.eventPassPendingOrder;
    expect(orders?.length).toBe(5);
    expect(orders?.[0].eventPassId).toBe('clj8raobj7g8l0aw3bfw6dny4');
    expect(orders?.[0].created_at).toBeDefined();
    expect(orders?.[0].id).toBeDefined();
    expect(orders?.[0].account).toBeDefined();
    expect(orders?.[0].account?.address).toBeDefined();
    expect(orders?.[0].eventPassPricing).toBeDefined();
    expect(orders?.[0].eventPassPricing?.timeBeforeDelete).toBeDefined();
  });
  it('should delete selected eventPassPendingOrders with their ids', async () => {
    const res = await adminSdk.GetEventPassPendingOrders();
    const orders = res.eventPassPendingOrder;
    const resDelete = await adminSdk.DeleteEventPassPendingOrders({
      ids: [orders?.[0].id, orders?.[2].id],
    });
    expect(resDelete.delete_eventPassPendingOrder?.affected_rows).toBe(2);
    const newOrders = await adminSdk.GetEventPassPendingOrders();
    expect(newOrders.eventPassPendingOrder?.length).toBe(3);
  });
});
