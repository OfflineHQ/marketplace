import { NextRedis } from '@next/redis';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  type PgClient,
} from '@test-utils/db';
import handler, {
  deleteOrders,
  MAX_PENDING_ORDERS,
  RedisOrderStatus,
  setOrdersToBusy,
} from './index';

describe('Minor functions Integration Tests', () => {
  const cache = new NextRedis();
  const testEventPassId = 'cs_testEventPassId';
  const testOrdersIds = Array.from({ length: 30 }, (_, i) => `order_${i + 1}`);

  beforeAll(async () => {
    for (const orderId of testOrdersIds) {
      await cache.kv.hset(testEventPassId, {
        [orderId]: RedisOrderStatus.Pending,
      });
    }
  });

  afterAll(async () => {
    await cache.kv.hdel(testEventPassId, ...testOrdersIds);
  });

  test('setOrdersToBusy updates order statuses to busy', async () => {
    await setOrdersToBusy(cache, testEventPassId, testOrdersIds.slice(0, 20));

    for (const orderId of testOrdersIds.slice(0, 20)) {
      const status = await cache.kv.hget(testEventPassId, orderId);
      expect(status).toEqual(RedisOrderStatus.Busy);
    }
  });

  test('deleteOrders removes orders from Redis', async () => {
    for (const orderId of testOrdersIds.slice(0, 10)) {
      const exists = await cache.kv.hget(testEventPassId, orderId);
      expect(exists).toEqual('busy');
    }

    await deleteOrders(cache, testEventPassId, testOrdersIds.slice(0, 10));

    for (const orderId of testOrdersIds.slice(0, 10)) {
      const exists = await cache.kv.hget(testEventPassId, orderId);
      expect(exists).toBeNull();
    }
  });

  test('Handling empty order lists does not throw errors', async () => {
    // Act & Assert: Neither function should throw an error with an empty list
    await expect(
      setOrdersToBusy(cache, testEventPassId, []),
    ).resolves.not.toThrow();
    await expect(
      deleteOrders(cache, testEventPassId, []),
    ).resolves.not.toThrow();
  });

  test('Orders already set to busy are not processed again', async () => {
    await setOrdersToBusy(cache, testEventPassId, testOrdersIds.slice(10, 20));

    await setOrdersToBusy(cache, testEventPassId, testOrdersIds.slice(10, 20));

    for (const orderId of testOrdersIds.slice(10, 20)) {
      const status = await cache.kv.hget(testEventPassId, orderId);
      expect(status).toEqual(RedisOrderStatus.Busy);
    }
  });
});

describe('handler Integration Tests', () => {
  const cache = new NextRedis();
  let consoleSpy: jest.SpyInstance;
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    await applySeeds(client, ['minterTemporaryWallet']);
  });

  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(async () => {
    consoleSpy.mockRestore();
    const keys = await cache.kv.keys('cs_*');
    await Promise.all(keys.map((key) => cache.kv.del(key)));
  });

  const setupOrders = async (eventPassId: string, ordersCount: number) => {
    const testOrdersIds = Array.from(
      { length: ordersCount },
      (_, i) => `order_${i + 1}`,
    );
    for (const orderId of testOrdersIds) {
      await cache.kv.hset(eventPassId, {
        [orderId]: RedisOrderStatus.Pending,
      });
    }
    return testOrdersIds;
  };

  test('Correctly processes and logs with a single order', async () => {
    const eventPassId = 'cs_testSingleOrder';
    await setupOrders(eventPassId, 1);

    await handler();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(eventPassId),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('1 orders'),
    );
  });

  test('Correctly processes and logs with multiple orders', async () => {
    const eventPassId = 'cs_testMultipleOrders';
    await setupOrders(eventPassId, 5);

    await handler();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(eventPassId),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('5 orders'),
    );
  });

  test('Handles empty order lists without logging order processing', async () => {
    await handler();

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('cs_testNoOrders'),
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('orders'),
    );
  });

  test('Processes and logs correctly with multiple eventPassIds', async () => {
    const eventPassIds = ['cs_testEventPassId1', 'cs_testEventPassId2'];
    await setupOrders(eventPassIds[0], 10);
    await setupOrders(eventPassIds[1], 15);

    await handler();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(eventPassIds[0]),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('10 orders'),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(eventPassIds[1]),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('15 orders'),
    );
  });

  test('Handles a large number of orders efficiently', async () => {
    const eventPassId = 'cs_testHighVolume';
    const largeOrderCount = 100;
    await setupOrders(eventPassId, largeOrderCount);

    await handler();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(eventPassId),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${MAX_PENDING_ORDERS} orders`),
    );
  });

  test('Processes orders efficiently for multiple eventPassIds with varying loads', async () => {
    const eventPassIds = [
      'cs_testEventPassId3',
      'cs_testEventPassId4',
      'cs_testEventPassId5',
      'cs_testEventPassId6',
      'cs_testEventPassId7',
    ];
    const ordersCounts = eventPassIds.map(
      () => Math.floor(Math.random() * (150 - 50 + 1)) + 50,
    );

    for (let i = 0; i < eventPassIds.length; i++) {
      await setupOrders(eventPassIds[i], ordersCounts[i]);
    }

    await handler();

    eventPassIds.forEach((id, index) => {
      const expectedOrdersCount = Math.min(
        MAX_PENDING_ORDERS,
        ordersCounts[index],
      );
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(id));
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${expectedOrdersCount} orders`),
      );
    });
  });
});
