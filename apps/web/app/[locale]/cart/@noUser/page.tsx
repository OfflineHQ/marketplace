import { NoUserCart, EventPassesServer } from '@features/cart/server';
export default async function NoUserCartSection() {
  return <NoUserCart EventPassesServer={EventPassesServer} />;
}
