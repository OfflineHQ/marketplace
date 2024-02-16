import { ReactQueryProviders } from '@next/react-query';
import { Toaster } from '@ui/components';
import { SessionProvider } from 'next-auth/react';

export const ToasterDecorator = (Story: any) => {
  return (
    <>
      <Story />
      <Toaster />
    </>
  );
};

export const SessionDecorator = (Story: any) => {
  return (
    <SessionProvider
      session={{ user: { id: '1234', address: '0x1234' }, expires: 'never' }}
    >
      <Story />
    </SessionProvider>
  );
};

export const ReactQueryDecorator = (Story: any) => {
  return (
    <ReactQueryProviders>
      <Story />
    </ReactQueryProviders>
  );
};
