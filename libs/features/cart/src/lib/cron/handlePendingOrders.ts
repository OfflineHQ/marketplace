import { NextResponse } from 'next/server';
import { adminSdk } from '@gql/admin/api';

export default async function handler() {
  try {
    // Fetch all pending orders
    const response = await adminSdk.GetEventPassPendingOrders();
    const pendingOrders = response.eventPassPendingOrder;

    // Filter out the orders that need to be deleted
    const currentTime = Math.floor(Date.now() / 1000); // Current UNIX timestamp

    const ordersToDelete: string[] = [];
    const accountsToNotify: Record<
      string,
      { address: string; email: string | null; eventPassIds: string[] }
    > = {};

    for (const order of pendingOrders) {
      const orderCreationTime = new Date(order.created_at).getTime() / 1000; // Convert to UNIX timestamp

      const deletionTime =
        orderCreationTime + (order.eventPassPricing?.timeBeforeDelete || 14400); // default to 4 hours
      if (currentTime >= deletionTime) {
        ordersToDelete.push(order.id);
        if (order.account?.address) {
          if (!accountsToNotify[order.account.address]) {
            accountsToNotify[order.account.address] = {
              address: order.account.address,
              email: order.account.email || null,
              eventPassIds: [order.eventPassId],
            };
          } else {
            accountsToNotify[order.account.address].eventPassIds.push(
              order.eventPassId
            );
          }
        }
      }
    }

    // Delete the expired orders
    await adminSdk.DeleteEventPassPendingOrders({ ids: ordersToDelete });

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
