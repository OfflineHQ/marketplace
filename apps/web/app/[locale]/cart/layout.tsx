import { getCurrentUser } from '@web/lib/session';

export interface CartLayoutProps {
  cartUser: React.ReactNode;
  noUser: React.ReactNode;
}

export default async function CartLayout({
  cartUser,
  noUser,
}: CartLayoutProps) {
  const session = await getCurrentUser();
  console.log({ session });
  return <section className="container">{session ? cartUser : noUser}</section>;
}
