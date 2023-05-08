import { Button, Text } from '@ui/components';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@client/next-auth/options';
import { logger } from '@logger';
// import { getCurrentUser } from '@web/lib/session';

export default async function Page() {
  // const user = await getCurrentUser();
  // console.log('user', user);
  const session = await getServerSession(authOptions);
  logger.debug('session', session);
  return (
    <>
      <Text variant="h1">Hello ! {session?.user?.id || ''}</Text>
      <Button>Connected Server Button</Button>
    </>
  );
}
