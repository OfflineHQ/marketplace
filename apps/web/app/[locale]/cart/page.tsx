import { getCurrentUser } from '@web/lib/session';
import { NoUserCart, UserCart } from '@features/cart/server';
import {
  EventPassesAnonymous,
  EventPassesUser,
  EventPassListSkeleton,
} from '@features/cart';
import { Suspense } from 'react';

export default async function CartSection() {
  const user = await getCurrentUser();
  return user ? (
    <Suspense fallback={<EventPassListSkeleton />}>
      <UserCart EventPassesFetcher={EventPassesUser} />
    </Suspense>
  ) : (
    <NoUserCart EventPassesFetcher={EventPassesAnonymous} />
  );
}
