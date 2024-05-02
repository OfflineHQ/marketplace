import { default as processRedisOrdersHandler } from '@features/orders-cron';

export default async function handler() {
  return await processRedisOrdersHandler();
}
