'use server';

import { PassCache } from '@features/pass-cache';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

const passCache = new PassCache();

export async function deleteAllEventPassesCart() {
  await passCache.deleteAllPassesCart();
  const user = await getCurrentUser();
  if (user) {
    await userSdk.DeleteAllPendingOrders();
  }
}
