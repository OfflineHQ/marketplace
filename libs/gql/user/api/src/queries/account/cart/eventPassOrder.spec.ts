import {
  alphaAdminClient,
  betaAdminClient,
  sebGoogleClient,
} from '@test-utils/gql';
import {
  deleteAccounts,
  seedDb,
  createDbClient,
  deleteTables,
  type PgClient,
} from '@test-utils/db';
import {
  OrderStatus_Enum,
  type EventPassOrder_Insert_Input,
} from '@gql/shared/types';

describe('tests for eventPassOrder', () => {
  let client: PgClient;
  const eventPass = {
    eventPassId: 'fake-event-pass-1',
  };
  const eventPass2 = {
    eventPassId: 'fake-event-pass-2',
  };
  const order1 = {
    ...eventPass,
    quantity: 1,
  } satisfies EventPassOrder_Insert_Input;

  const order2 = {
    ...eventPass2,
    quantity: 2,
  } satisfies EventPassOrder_Insert_Input;

  const alphaAdmin = alphaAdminClient();
  const betaAdmin = betaAdminClient();
  const sebGoogle = sebGoogleClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassOrder", "eventPassPricing"');
    await seedDb(client, './tools/test/seeds/account.sql');
    await seedDb(client, './tools/test/seeds/eventPassPricing.sql');
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassOrder", "eventPassPricing"');
    await client.end();
  });
  afterEach(async () => {
    await deleteTables(client, '"eventPassOrder"');
  });

  it('should create eventPassOrder', async () => {
    const res = await alphaAdmin.UpsertEventPassOrders({
      objects: order1,
    });
    const orders = res.insert_eventPassOrder?.returning;
    expect(orders?.length).toBe(1);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[0].status).toBe(OrderStatus_Enum.Pending);
  });
  it('should create several eventPassOrder', async () => {
    const res = await alphaAdmin.UpsertEventPassOrders({
      objects: [order1, order2],
    });
    const orders = res.insert_eventPassOrder?.returning;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[0].status).toBe(OrderStatus_Enum.Pending);
    expect(orders?.[1].eventPassId).toBe(order2.eventPassId);
    expect(orders?.[1].quantity).toBe(order2.quantity);
    expect(orders?.[1].status).toBe(OrderStatus_Enum.Pending);
  });
  it('should update order with new quantity if order already exists', async () => {
    await alphaAdmin.UpsertEventPassOrders({
      objects: [order1, order2],
    });
    const res = await alphaAdmin.UpsertEventPassOrders({
      objects: [order1, { ...order2, quantity: 3 }],
    });
    const orders = res.insert_eventPassOrder?.returning;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[0].status).toBe(OrderStatus_Enum.Pending);
    expect(orders?.[1].eventPassId).toBe(order2.eventPassId);
    expect(orders?.[1].quantity).toBe(3);
    expect(orders?.[1].status).toBe(OrderStatus_Enum.Pending);
  });
  it('should create eventPassOrder with two successive users on same events', async () => {
    const alphaRes = await alphaAdmin.UpsertEventPassOrders({
      objects: [order1, order2],
    });
    const betaRes = await betaAdmin.UpsertEventPassOrders({
      objects: [order1, order2],
    });
    const alphaOrders = alphaRes.insert_eventPassOrder?.returning;
    const betaOrders = betaRes.insert_eventPassOrder?.returning;
    expect(alphaOrders?.length).toBe(2);
    expect(betaOrders?.length).toBe(2);
  });
  it('should allow multiple orders on same eventPassId', async () => {
    const res = await alphaAdmin.UpsertEventPassOrders({
      objects: [order1, order1, order2, order2],
    });
    const orders = res.insert_eventPassOrder?.returning;
    expect(orders?.length).toBe(4);
  });
  it("should return an error in case eventPassId doesn't have a corresponding eventPassPricing", async () => {
    await expect(
      alphaAdmin.UpsertEventPassOrders({
        objects: [{ ...order1, eventPassId: 'fake-dummy' }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an order', async () => {
    await expect(
      alphaAdmin.UpsertEventPassOrders({
        objects: [{ ...order1, quantity: 101 }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an updated order', async () => {
    await alphaAdmin.UpsertEventPassOrders({
      objects: [order1],
    });
    await expect(
      alphaAdmin.UpsertEventPassOrders({
        objects: [{ ...order1, quantity: 1000 }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an order from an other user', async () => {
    await alphaAdmin.UpsertEventPassOrders({
      objects: [order1],
    });
    await expect(
      betaAdmin.UpsertEventPassOrders({
        objects: [{ ...order1, quantity: 100 }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on maxAmountPerUser if exist on event', async () => {
    await expect(
      alphaAdmin.UpsertEventPassOrders({
        objects: [{ ...order2, quantity: 11 }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on maxAmountPerUser if exist on event for an updated order', async () => {
    await alphaAdmin.UpsertEventPassOrders({
      objects: [order2],
    });
    await expect(
      alphaAdmin.UpsertEventPassOrders({
        objects: [{ ...order2, quantity: 10 }],
      })
    ).rejects.toThrow();
  });
});
