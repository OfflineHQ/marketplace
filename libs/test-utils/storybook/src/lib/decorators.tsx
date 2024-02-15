import { Toaster } from '@ui/components';
import { SessionProvider } from 'next-auth/react';

export const ToasterDecorator = (Story) => {
  return (
    <>
      <Story />
      <Toaster />
    </>
  );
};

export const SessionDecorator = (Story) => {
  return (
    <SessionProvider
      session={{ user: { id: '1234', address: '0x1234' }, expires: 'never' }}
    >
      <Story />
    </SessionProvider>
  );
};
