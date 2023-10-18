import { cache } from 'react';
import { userSdk } from '@gql/user/api';
import type { EventPassOrder_Insert_Input } from '@gql/shared/types';

interface InsertEventPassPendingOrdersProps {
  orders: EventPassOrder_Insert_Input;
}
// TODO invalidate cache for the getEventCart query
export const insertEventPassPendingOrders = cache(
  async ({ orders }: InsertEventPassPendingOrdersProps) => {
    if (!orders) return;
    // TODO throw an error if two orders have the same eventPassId (avoid creation of several order with status "pending" on same eventPass)
    const res = await userSdk.InsertEventPassPendingOrders({
      objects: orders,
    });
    return res.insert_eventPassPendingOrder?.returning;
  }
);
