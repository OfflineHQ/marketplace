import { NoUserPass } from '@features/pass/server';
import { getCurrentUser } from '@web/lib/session';

export default async function PassSection() {
  const user = await getCurrentUser();
  return user ? <div>Pass for user {user.id}</div> : <NoUserPass />;
}
