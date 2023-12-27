import { adminSdk } from '@gql/admin/api';
import { NextResponse } from 'next/server';

export default async function handler() {
  try {
    // Fetch all pending orders
    const response = await adminSdk.GetPendingOrders();
    const pendingOrders = response.pendingOrder;

    // Filter out the orders that need to be deleted
    const currentTime = Math.floor(Date.now() / 1000); // Current UNIX timestamp

    const ordersToDelete: string[] = [];
    const accountsToNotify: Record<
      string,
      {
        address: string;
        email: string | null;
        eventPassIds: string[];
        packIds: string[];
      }
    > = {};

    for (const order of pendingOrders) {
      const orderCreationTime = new Date(order.created_at).getTime() / 1000; // Convert to UNIX timestamp

      const deletionTime =
        orderCreationTime +
        (order?.passAmount?.timeBeforeDelete ||
          order?.packAmount?.timeBeforeDelete ||
          14400); // default to 4 hours
      if (currentTime >= deletionTime) {
        ordersToDelete.push(order.id);
        if (order.account?.address) {
          if (!accountsToNotify[order.account.address]) {
            accountsToNotify[order.account.address] = {
              address: order.account.address,
              email: order.account.email || null,
              eventPassIds: order.eventPassId ? [order.eventPassId] : [],
              packIds: order.packId ? [order.packId] : [],
            };
          } else {
            if (order.eventPassId) {
              accountsToNotify[order.account.address].eventPassIds.push(
                order.eventPassId,
              );
            }
            if (order.packId) {
              accountsToNotify[order.account.address].packIds.push(
                order.packId,
              );
            }
          }
        }
      }
    }

    // Delete the expired orders
    await adminSdk.DeletePendingOrders({ ids: ordersToDelete });

    // TODO : send email to accountsToNotify if authorized in settings and add notification

    // Return the accounts to be notified along with the orders deleted
    const res = {
      accountsToNotify: Object.values(accountsToNotify),
      ordersToDelete,
    };
    return new NextResponse(JSON.stringify(res), {
      status: 200,
    });
  } catch (error) {
    console.error('Error handling pending orders', error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
