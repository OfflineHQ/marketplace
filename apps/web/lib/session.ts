import { getServerSession } from 'next-auth/next';
import { authOptions } from '@client/next-auth/options';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
