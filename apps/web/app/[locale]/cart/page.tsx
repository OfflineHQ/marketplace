import { getCurrentUser } from '@web/lib/session';
import { NoUserCart } from '@features/cart/server';
import { EventPassesClient } from '@features/cart';

export default async function CartSection() {
  const user = await getCurrentUser();
  return user ? (
    <div>Cart for user {user.id}</div>
  ) : (
    <NoUserCart EventPassesFetcher={EventPassesClient} />
  );
}
