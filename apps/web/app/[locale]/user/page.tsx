import { Button, Text } from '@ui/components';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@next/next-auth/options';
import { logger } from '@logger';

export default async function Page() {
  const session = await getServerSession(authOptions);
  logger.debug('session', session);
  return (
    <>
      <Text variant="h1">Hello ! {session?.user?.id || ''}</Text>
      <Button>Connected Server Button</Button>
    </>
  );
}
