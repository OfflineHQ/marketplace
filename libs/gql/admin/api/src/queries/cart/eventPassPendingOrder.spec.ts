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
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await seedDb(client, './hasura/app/seeds/default/account.sql');
    await seedDb(client, './hasura/app/seeds/default/eventPassPricing.sql');
    await seedDb(
      client,
      './hasura/app/seeds/default/eventPassPendingOrder.sql'
    );
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await client.end();
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
});
