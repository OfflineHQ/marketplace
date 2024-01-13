import { adminSdk } from '@gql/admin/api';
import { NextResponse } from 'next/server';

type Order = Awaited<
  ReturnType<typeof adminSdk.GetPendingOrders>
>['pendingOrder'][0];

interface AccountNotification {
  address: string;
  email?: string | null;
  eventPassIds: string[];
  packIds: string[];
}

export async function filterOrdersToDelete(
  orders: Order[],
  currentTime: number,
): Promise<string[]> {
  const ordersToDelete: string[] = [];

  // TODO : do the same for packs with the packId and packParameters
  // extract all eventPassIds from the orders and remove duplicates
  const eventPassIds = Array.from(
    new Set(
      orders
        .filter((order) => order.eventPassId)
        .map((order) => order.eventPassId as string),
    ),
  );
  const eventPassWithParametersResponse =
    await adminSdk.GetEventParametersFromEventPassIds({ eventPassIds });
  const eventPassIdIsSaleOngoing =
    eventPassWithParametersResponse.eventPasses.reduce(
      (acc, eventPass) => {
        acc[eventPass.id] = !!eventPass.event?.eventParameters?.isSaleOngoing;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  for (const order of orders) {
    const isSaleOngoing = order.eventPassId
      ? eventPassIdIsSaleOngoing[order.eventPassId]
      : true; // TODO: change "true" for "packIdIsSaleOngoing[order.packId]" when packs are implemented
    if (!isSaleOngoing || isOrderPastDeletionTime(order, currentTime)) {
      ordersToDelete.push(order.id);
    }
  }

  return ordersToDelete;
}

export function isOrderPastDeletionTime(
  order: Order,
  currentTime: number,
): boolean {
  const orderCreationTime = new Date(order.created_at).getTime() / 1000; // Convert to UNIX timestamp
  const deletionTime =
    orderCreationTime +
    (order.passAmount?.timeBeforeDelete ||
      order.packAmount?.timeBeforeDelete ||
      14400); // Default to 4 hours
  return currentTime >= deletionTime;
}

export function prepareAccountsToNotify(
  orders: Order[],
  ordersToDelete: string[],
): Record<string, AccountNotification> {
  const accountsToNotify: Record<string, AccountNotification> = {};

  for (const orderId of ordersToDelete) {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.account?.address) {
      const account = order.account;

      if (!accountsToNotify[account.address]) {
        accountsToNotify[account.address] = {
          address: account.address,
          email: account.email || null,
          eventPassIds: order.eventPassId ? [order.eventPassId] : [],
          packIds: order.packId ? [order.packId] : [],
        };
      } else {
        if (order.eventPassId) {
          accountsToNotify[account.address].eventPassIds.push(
            order.eventPassId,
          );
        }
        if (order.packId) {
          accountsToNotify[account.address].packIds.push(order.packId);
        }
      }
    }
  }

  return accountsToNotify;
}

export default async function handler() {
  try {
    // Fetch all pending orders
    const currentTime = Math.floor(Date.now() / 1000); // Current UNIX timestamp
    const response = await adminSdk.GetPendingOrders();
    const pendingOrders = response.pendingOrder;

    const ordersToDelete = await filterOrdersToDelete(
      pendingOrders,
      currentTime,
    );
    // Return the accounts to be notified along with the orders deleted
    const accountsToNotify = prepareAccountsToNotify(
      pendingOrders,
      ordersToDelete,
    );
    // TODO : send email to accountsToNotify if authorized in settings and add notification to inform the user has been deleted and why (sale ended or time expired)

    // Delete the expired orders
    await adminSdk.DeletePendingOrders({ ids: ordersToDelete });

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
