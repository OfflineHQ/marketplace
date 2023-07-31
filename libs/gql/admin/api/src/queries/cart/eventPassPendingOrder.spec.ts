import {
  deleteAccounts,
  seedDb,
  createDbClient,
  deleteTables,
  type PgClient,
} from '@test-utils/db';
import { adminSdk } from '../../generated';

describe('tests for eventPassPendingOrder admin', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAccounts(client);
    await seedDb(client, './hasura/app/seeds/default/0_account.sql');
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await client.end();
  });
  beforeEach(async () => {
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await seedDb(client, './hasura/app/seeds/default/1_eventPassPricing.sql');
    await seedDb(
      client,
      './hasura/app/seeds/default/2_eventPassPendingOrder.sql'
    );
  });

  it('should retrieve all existing eventPassPendingOrder', async () => {
    const res = await adminSdk.GetEventPassPendingOrders();
    const orders = res.eventPassPendingOrder;
    expect(orders?.length).toBe(3);
    expect(orders?.[0].eventPassId).toBe('fake-event-pass-1');
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
    expect(newOrders.eventPassPendingOrder?.length).toBe(1);
  });
});
