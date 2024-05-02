import { adminSdk } from '@gql/admin/api';
import { NextRedis } from '@next/redis';
import { getNextAppURL } from '@shared/server';
import { isJestRunning } from '@utils';

export enum RedisOrderStatus {
  Pending = 'pending',
  Busy = 'busy',
}

export async function setOrdersToBusy(
  cache: NextRedis,
  eventPassId: string,
  pendingOrders: string[],
) {
  const pipeline = cache.kv.pipeline();
  for (const orderId of pendingOrders) {
    pipeline.hset(eventPassId, { [orderId]: RedisOrderStatus.Busy });
  }
  try {
    await pipeline.exec();
  } catch (error) {
    console.error('Error executing pipeline setOrdersToBusy :', error);
  }
}

export async function setOrdersToPending(
  cache: NextRedis,
  eventPassId: string,
  pendingOrders: string[],
) {
  const pipeline = cache.kv.pipeline();
  for (const orderId of pendingOrders) {
    pipeline.hset(eventPassId, { [orderId]: RedisOrderStatus.Pending });
  }
  try {
    await pipeline.exec();
  } catch (error) {
    console.error('Error executing pipeline setOrdersToPending :', error);
  }
}

export async function deleteOrders(
  cache: NextRedis,
  eventPassId: string,
  pendingOrders: string[],
) {
  const pipeline = cache.kv.pipeline();
  for (const orderId of pendingOrders) {
    pipeline.hdel(eventPassId, orderId);
  }
  try {
    await pipeline.exec();
  } catch (error) {
    console.error('Error executing pipeline for deleteOrders:', error);
  }
}

export const MAX_PENDING_ORDERS = 20;

export default async function handler() {
  const cache = new NextRedis();
  let keys;
  try {
    keys = await cache.kv.keys('cs_*');
  } catch (error) {
    console.error('Error fetching keys:', error);
    return;
  }

  const processKeyPromises = keys.map((key) => processKey(cache, key));
  try {
    await Promise.allSettled(processKeyPromises);
  } catch (error) {
    console.error('Error processing keys:', error);
  }
}

async function processKey(cache: NextRedis, key: string) {
  try {
    const minterTemporaryWallet = await getMinterTemporaryWallet(key);
    if (!minterTemporaryWallet) return;

    const walletStatus = await cache.kv.get(minterTemporaryWallet.address);
    if (walletStatus === 'busy') {
      console.log(
        `Address ${minterTemporaryWallet.address} is busy, skipping ${key}.`,
      );
      return;
    }

    const pendingOrders = await getPendingOrders(cache, key);
    if (pendingOrders.length > 0) {
      await postOrders(pendingOrders, key);
    }
  } catch (error) {
    console.error(`Failed to process orders for ${key}:`, error);
  }
}

async function getMinterTemporaryWallet(key: string) {
  const response = await adminSdk.GetMinterTemporaryWalletByEventPassId({
    eventPassId: key,
  });
  const wallet = response.minterTemporaryWallet[0];
  if (!wallet) {
    console.error(`No minterTemporaryWallet for eventPassId: ${key}`);
  }
  return wallet;
}

async function postOrders(pendingOrders: string[], key: string) {
  const body = JSON.stringify({ orderIds: pendingOrders, eventPassId: key });
  try {
    if (!isJestRunning()) {
      fetch(`${getNextAppURL()}/api/orders/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
    }
    console.log(
      `Processed ${pendingOrders.length} orders for eventPassId ${key}: ${pendingOrders}`,
    );
  } catch (error) {
    console.error('Error posting orders:', error);
  }
}

async function getPendingOrders(
  cache: NextRedis,
  eventPassId: string,
): Promise<string[]> {
  const ordersData = (await cache.kv.hgetall(eventPassId)) || {};
  return Object.entries(ordersData)
    .filter(([, value]) => value === RedisOrderStatus.Pending)
    .slice(0, MAX_PENDING_ORDERS)
    .map(([key]) => key);
}
