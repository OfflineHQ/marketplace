import type { PendingOrder_Insert_Input, Stage } from '@gql/shared/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  deleteTables,
  seedDb,
  type PgClient,
} from '@test-utils/db';
import { alphaUserClient, betaUserClient } from '@test-utils/gql';

describe('tests for pendingOrder user', () => {
  let client: PgClient;
  const eventPass = {
    eventPassId: 'clj8raobj7g8l0aw3bfw6dny4',
  };
  const eventPass2 = {
    eventPassId: 'fake-event-pass-2',
  };
  const order1 = {
    ...eventPass,
    quantity: 1,
  } satisfies PendingOrder_Insert_Input;

  const order2 = {
    ...eventPass2,
    quantity: 2,
  } satisfies PendingOrder_Insert_Input;

  const alphaUser = alphaUserClient();
  const betaUser = betaUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, ['account', 'eventPassPricing']);
  });
  afterAll(async () => {
    await deleteTables(client, ['account', 'pendingOrder', 'eventPassPricing']);
    await client.end();
  });
  afterEach(async () => {
    await deleteTables(client, ['pendingOrder']);
  });

  it('should create pendingOrder', async () => {
    const res = await alphaUser.UpsertEventPassPendingOrders({
      objects: order1,
      stage: 'DRAFT' as Stage,
    });
    const orders = res.insert_pendingOrder?.returning;
    expect(orders?.length).toBe(1);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
  });
  it('should create several pendingOrder', async () => {
    const res = await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const orders = res.insert_pendingOrder?.returning;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[1].eventPassId).toBe(order2.eventPassId);
    expect(orders?.[1].quantity).toBe(order2.quantity);
  });

  it('should allow update of order with new quantity even if order already exists', async () => {
    const res = await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const orders = res.insert_pendingOrder?.returning;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);

    const res2 = await alphaUser.UpsertEventPassPendingOrders({
      objects: [{ ...order2, quantity: 3 }],
      stage: 'DRAFT' as Stage,
    });
    const orders2 = res2.insert_pendingOrder?.returning;
    expect(orders2?.length).toBe(1);
    expect(orders2?.[0].eventPassId).toBe(order2.eventPassId);
    expect(orders2?.[0].quantity).toBe(3);
  });

  it('should create pendingOrder with two successive users on same events', async () => {
    const alphaRes = await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const betaRes = await betaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const alphaOrders = alphaRes.insert_pendingOrder?.returning;
    const betaOrders = betaRes.insert_pendingOrder?.returning;
    expect(alphaOrders?.length).toBe(2);
    expect(betaOrders?.length).toBe(2);
  });

  it('should return order for a user given an eventPassId', async () => {
    await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    await betaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const res = await alphaUser.GetPendingOrderForEventPasses({
      eventPassIds: order1.eventPassId,
    });
    const orders = res.pendingOrder;
    expect(orders?.length).toBe(1);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
  });

  it('should return several orders for a user given several eventPassIds', async () => {
    await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const res = await alphaUser.GetPendingOrderForEventPasses({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    const orders = res.pendingOrder;
    expect(orders?.length).toBe(2);
    expect(orders?.[0].eventPassId).toBe(order1.eventPassId);
    expect(orders?.[0].quantity).toBe(order1.quantity);
    expect(orders?.[1].eventPassId).toBe(order2.eventPassId);
    expect(orders?.[1].quantity).toBe(order2.quantity);
  });

  it("shouldn't return orders for an user given an eventPassId where the user has no orders", async () => {
    await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1],
      stage: 'DRAFT' as Stage,
    });
    const res = await alphaUser.GetPendingOrderForEventPasses({
      eventPassIds: 'fake-dummy',
    });
    const orders = res.pendingOrder;
    expect(orders?.length).toBe(0);
    await betaUser.UpsertEventPassPendingOrders({
      objects: [order2],
      stage: 'DRAFT' as Stage,
    });
    const res2 = await alphaUser.GetPendingOrderForEventPasses({
      eventPassIds: order2.eventPassId,
    });
    const orders2 = res2.pendingOrder;
    expect(orders2?.length).toBe(0);
  });

  it('should delete an order successfully', async () => {
    const res = await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1],
      stage: 'DRAFT' as Stage,
    });
    const orders = res.insert_pendingOrder?.returning;
    const pendingOrderId = orders?.[0].id;
    const resDelete = await alphaUser.DeletePendingOrder({
      pendingOrderId: pendingOrderId,
    });
    expect(resDelete.delete_pendingOrder_by_pk?.id).toBe(pendingOrderId);
  });

  it('should delete orders given eventPassIds successfully', async () => {
    await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    await betaUser.UpsertEventPassPendingOrders({
      objects: [order1, order2],
      stage: 'DRAFT' as Stage,
    });
    const resDelete = await alphaUser.DeletePendingOrders({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    expect(resDelete.delete_pendingOrder?.affected_rows).toBe(2);
    const res = await alphaUser.GetPendingOrderForEventPasses({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    const orders = res.pendingOrder;
    expect(orders?.length).toBe(0);
    const resBeta = await betaUser.GetPendingOrderForEventPasses({
      eventPassIds: [order1.eventPassId, order2.eventPassId],
    });
    const ordersBeta = resBeta.pendingOrder;
    expect(ordersBeta?.length).toBe(2);
  });

  it('should return all user pending orders', async () => {
    await seedDb(client, 'pendingOrder');
    const data = await alphaUser.GetPendingOrders({
      stage: 'DRAFT' as Stage,
    });
    const orders = data.pendingOrder;
    expect(orders?.length).toBe(2);
  });

  it("shouldn't create pendingOrder with quantity not positive", async () => {
    await expect(
      alphaUser.UpsertEventPassPendingOrders({
        objects: { ...order1, quantity: 0 },
        stage: 'DRAFT' as Stage,
      }),
    ).rejects.toThrow();
  });

  it('shouldn`t allow insert multiple orders on same eventPassId', async () => {
    await expect(
      alphaUser.UpsertEventPassPendingOrders({
        objects: [order1, order1],
        stage: 'DRAFT' as Stage,
      }),
    ).rejects.toThrow();
  });

  it("should return an error in case eventPassId doesn't have a corresponding eventPassPricing", async () => {
    await expect(
      alphaUser.UpsertEventPassPendingOrders({
        objects: [{ ...order1, eventPassId: 'fake-dummy' }],
        stage: 'DRAFT' as Stage,
      }),
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an order', async () => {
    await expect(
      alphaUser.UpsertEventPassPendingOrders({
        objects: [{ ...order1, quantity: 101 }],
        stage: 'DRAFT' as Stage,
      }),
    ).rejects.toThrow();
  });

  it('should enforce limit on quantity for an order from an other user', async () => {
    await alphaUser.UpsertEventPassPendingOrders({
      objects: [order1],
      stage: 'DRAFT' as Stage,
    });
    await expect(
      betaUser.UpsertEventPassPendingOrders({
        objects: [{ ...order1, quantity: 100 }],
        stage: 'DRAFT' as Stage,
      }),
    ).rejects.toThrow();
  });

  it('should enforce limit on maxAmountPerUser if exist on event', async () => {
    await expect(
      alphaUser.UpsertEventPassPendingOrders({
        objects: [{ ...order2, quantity: 11 }],
        stage: 'DRAFT' as Stage,
      }),
    ).rejects.toThrow();
  });
});
