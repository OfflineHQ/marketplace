import { Button } from '@ui/components';
import { SessionProvider } from 'next-auth/react';
import { SumsubDialog, SumsubDialogProps } from './SumsubDialog';

export const sumsubDialogProps = {
  defaultOpen: true,
  testEnv: true,
  accessToken: 'your_access_token',
  expirationHandler: async () => {
    // handle token expiration here
    return 'your_access_token';
  },
  onMessage: (message: any) => {
    // handle message here
  },
  onError: (error: any) => {
    // handle error here
  },
} satisfies SumsubDialogProps;

export const SumsubDialogExample = (props: SumsubDialogProps) => {
  return (
    <SessionProvider>
      <SumsubDialog {...props}>
        <Button>Open Dialog</Button>
      </SumsubDialog>
    </SessionProvider>
  );
};
