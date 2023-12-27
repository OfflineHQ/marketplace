import {
  applySeeds,
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
} from '@test-utils/db';
import { adminSdk } from '../../generated';

describe('tests for pendingOrder admin', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteTables(client, ['account']);
    await seedDb(client, 'account');
  });
  afterAll(async () => {
    await deleteTables(client, ['account', 'pendingOrder', 'passAmount']);
    await client.end();
  });
  beforeEach(async () => {
    await deleteTables(client, ['pendingOrder', 'passAmount']);
    await applySeeds(client, ['passAmount', 'pendingOrder']);
  });

  it('should retrieve all existing pendingOrder', async () => {
    const res = await adminSdk.GetPendingOrders();
    const orders = res.pendingOrder;
    expect(orders?.length).toBe(5);
    console.log(orders);
    expect(orders?.[0].eventPassId).toBe('clj8raobj7g8l0aw3bfw6dny4');
    expect(orders?.[0].created_at).toBeDefined();
    expect(orders?.[0].id).toBeDefined();
    expect(orders?.[0].account).toBeDefined();
    expect(orders?.[0].account?.address).toBeDefined();
    expect(orders?.[0].passAmount).toBeDefined();
    expect(orders?.[0].passAmount?.timeBeforeDelete).toBeDefined();
  });
  it('should delete selected pendingOrders with their ids', async () => {
    const res = await adminSdk.GetPendingOrders();
    const orders = res.pendingOrder;
    const resDelete = await adminSdk.DeletePendingOrders({
      ids: [orders?.[0].id, orders?.[2].id],
    });
    expect(resDelete.delete_pendingOrder?.affected_rows).toBe(2);
    const newOrders = await adminSdk.GetPendingOrders();
    expect(newOrders.pendingOrder?.length).toBe(3);
  });
});
