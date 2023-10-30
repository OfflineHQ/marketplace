import { handlePendingOrders } from '@features/cart-cron';

export default async function handler() {
  return await handlePendingOrders();
}
