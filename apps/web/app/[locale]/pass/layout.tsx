import { getCurrentUser } from '@web/lib/session';

export interface PassLayoutProps {
  passUser: React.ReactNode;
  noUser: React.ReactNode;
}

export default async function PassLayout({
  passUser,
  noUser,
}: PassLayoutProps) {
  const user = await getCurrentUser();
  return <section className="container">{user ? passUser : noUser}</section>;
}
