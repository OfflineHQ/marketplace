import { getCurrentUser } from '@web/lib/session';

export interface CartLayoutProps {
  cartUser: React.ReactNode;
  noUser: React.ReactNode;
}

export default async function CartLayout({
  cartUser,
  noUser,
}: CartLayoutProps) {
  const user = await getCurrentUser();
  return <section className="container">{user ? cartUser : noUser}</section>;
}
