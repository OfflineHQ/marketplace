import { alphaAdminClient, betaAdminClient } from '@test-utils/gql';
import {
  deleteAccounts,
  seedDb,
  createDbClient,
  deleteTables,
  type PgClient,
} from '@test-utils/db';
import type {
  EventPassPendingOrder_Insert_Input,
  Locale,
  Stage,
} from '@gql/shared/types';

describe('tests for eventPassPendingOrder user', () => {
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
  } satisfies EventPassPendingOrder_Insert_Input;

  const order2 = {
    ...eventPass2,
    quantity: 2,
  } satisfies EventPassPendingOrder_Insert_Input;

  const alphaAdmin = alphaAdminClient();
  const betaAdmin = betaAdminClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await seedDb(client, './hasura/app/seeds/default/0_account.sql');
    await seedDb(client, './hasura/app/seeds/default/1_eventPassPricing.sql');
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await client.end();
  });
  afterEach(async () => {
    await deleteTables(client, '"eventPassPendingOrder"');
  });

  it('should create eventPassPendingOrder', async () => {
    const res = await alphaAdmin.InsertEventPassPendingOrders({
      objects: order1,
    });
    const orders = res.insert_eventPassPendingOrder?.returning;
    expect(orders?.length).toBe(1);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
  });
  it('should create several eventPassPendingOrder', async () => {
    const res = await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    const orders = res.insert_eventPassPendingOrder?.returning;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[1].eventPassId).toBe(order2.eventPassId);
    expect(orders?.[1].quantity).toBe(order2.quantity);
  });

  it('should create eventPassPendingOrder with two successive users on same events', async () => {
    const alphaRes = await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    const betaRes = await betaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    const alphaOrders = alphaRes.insert_eventPassPendingOrder?.returning;
    const betaOrders = betaRes.insert_eventPassPendingOrder?.returning;
    expect(alphaOrders?.length).toBe(2);
    expect(betaOrders?.length).toBe(2);
  });

  it('should return order for a user given an eventPassId', async () => {
    await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    await betaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    const res = await alphaAdmin.GetEventPassPendingOrderForEventPasses({
      eventPassIds: order1.eventPassId,
    });
    const orders = res.eventPassPendingOrder;
    expect(orders?.length).toBe(1);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
  });

  it('should return several orders for a user given several eventPassIds', async () => {
    await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    const res = await alphaAdmin.GetEventPassPendingOrderForEventPasses({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    const orders = res.eventPassPendingOrder;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[1].eventPassId).toBe(order2.eventPassId);
    expect(orders?.[1].quantity).toBe(order2.quantity);
  });

  it("shouldn't return orders for an user given an eventPassId where the user has no orders", async () => {
    await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1],
    });
    const res = await alphaAdmin.GetEventPassPendingOrderForEventPasses({
      eventPassIds: 'fake-dummy',
    });
    const orders = res.eventPassPendingOrder;
    expect(orders?.length).toBe(0);
    await betaAdmin.InsertEventPassPendingOrders({
      objects: [order2],
    });
    const res2 = await alphaAdmin.GetEventPassPendingOrderForEventPasses({
      eventPassIds: order2.eventPassId,
    });
    const orders2 = res2.eventPassPendingOrder;
    expect(orders2?.length).toBe(0);
  });

  it('should delete an order successfully', async () => {
    const res = await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1],
    });
    const orders = res.insert_eventPassPendingOrder?.returning;
    const eventPassPendingOrderId = orders?.[0].id;
    const resDelete = await alphaAdmin.DeleteEventPassPendingOrder({
      eventPassPendingOrderId: eventPassPendingOrderId,
    });
    expect(resDelete.delete_eventPassPendingOrder_by_pk?.id).toBe(
      eventPassPendingOrderId
    );
  });

  it('should delete orders given eventPassIds successfully', async () => {
    await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    await betaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    const resDelete = await alphaAdmin.DeleteEventPassPendingOrders({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    expect(resDelete.delete_eventPassPendingOrder?.affected_rows).toBe(2);
    const res = await alphaAdmin.GetEventPassPendingOrderForEventPasses({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    const orders = res.eventPassPendingOrder;
    expect(orders?.length).toBe(0);
    const resBeta = await betaAdmin.GetEventPassPendingOrderForEventPasses({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    const ordersBeta = resBeta.eventPassPendingOrder;
    expect(ordersBeta?.length).toBe(2);
  });

  it('should return all user pending orders', async () => {
    await seedDb(
      client,
      './hasura/app/seeds/default/2_eventPassPendingOrder.sql'
    );
    const data = await alphaAdmin.GetEventPassPendingOrders({
      locale: 'en' as Locale,
      stage: 'DRAFT' as Stage,
    });
    const orders = data.eventPassPendingOrder;
    expect(orders?.length).toBe(2);
  });

  it("shouldn't create eventPassPendingOrder with quantity not positive", async () => {
    await expect(
      alphaAdmin.InsertEventPassPendingOrders({
        objects: { ...order1, quantity: 0 },
      })
    ).rejects.toThrow();
  });

  it('shouldn`t allow insert multiple orders on same eventPassId', async () => {
    await expect(
      alphaAdmin.InsertEventPassPendingOrders({
        objects: [order1, order1],
      })
    ).rejects.toThrow();
  });

  it("shouldn't allow update of order with new quantity if order already exists", async () => {
    await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1, order2],
    });
    await expect(
      alphaAdmin.InsertEventPassPendingOrders({
        objects: [{ ...order2, quantity: 3 }],
      })
    ).rejects.toThrow();
  });

  it("should return an error in case eventPassId doesn't have a corresponding eventPassPricing", async () => {
    await expect(
      alphaAdmin.InsertEventPassPendingOrders({
        objects: [{ ...order1, eventPassId: 'fake-dummy' }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an order', async () => {
    await expect(
      alphaAdmin.InsertEventPassPendingOrders({
        objects: [{ ...order1, quantity: 101 }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an order from an other user', async () => {
    await alphaAdmin.InsertEventPassPendingOrders({
      objects: [order1],
    });
    await expect(
      betaAdmin.InsertEventPassPendingOrders({
        objects: [{ ...order1, quantity: 100 }],
      })
    ).rejects.toThrow();
  });

  it('should enforce limit on maxAmountPerUser if exist on event', async () => {
    await expect(
      alphaAdmin.InsertEventPassPendingOrders({
        objects: [{ ...order2, quantity: 11 }],
      })
    ).rejects.toThrow();
  });
});
