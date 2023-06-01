import { getCurrentUser } from '@web/lib/session';

export interface PassLayoutProps {
  passUser: React.ReactNode;
  noUser: React.ReactNode;
}

export default async function PassLayout({
  passUser,
  noUser,
}: PassLayoutProps) {
  const session = await getCurrentUser();
  console.log('session', session);
  return <section className="container">{session ? passUser : noUser}</section>;
}
