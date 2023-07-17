import { getCurrentUser } from '@web/lib/session';
import { NoUserCart, UserCart } from '@features/cart/server';
import { EventPassesAnonymous, EventPassesUser } from '@features/cart';

export default async function CartSection() {
  const user = await getCurrentUser();
  return user ? (
    <UserCart EventPassesFetcher={EventPassesUser} />
  ) : (
    <NoUserCart EventPassesFetcher={EventPassesAnonymous} />
  );
}
