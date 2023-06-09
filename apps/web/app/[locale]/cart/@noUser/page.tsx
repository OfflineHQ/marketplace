import { NoUserCart } from '@features/cart/server';
import { EventPassesClient } from '@features/cart';

export default async function NoUserCartSection() {
  return <NoUserCart EventPassesFetcher={EventPassesClient} />;
}
