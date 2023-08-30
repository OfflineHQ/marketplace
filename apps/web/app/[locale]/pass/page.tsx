import { NoUserPass } from '@features/pass/server';
import { getCurrentUser } from '@next/next-auth/user';

export default async function PassSection() {
  const user = await getCurrentUser();
  return user ? <div>Pass for user {user.id}</div> : <NoUserPass />;
}
