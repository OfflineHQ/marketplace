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
  return <>{user ? passUser : noUser}</>;
}
