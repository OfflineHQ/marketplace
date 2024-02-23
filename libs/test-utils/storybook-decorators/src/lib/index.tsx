import { ReactQueryProviders } from '@next/react-query';
import { StoryFn } from '@storybook/react';
import { Toaster } from '@ui/components';
import { SessionProvider } from 'next-auth/react';

export const ToasterDecorator = (Story: StoryFn) => {
  return (
    <>
      <Story />
      <Toaster />
    </>
  );
};

export const SessionDecorator = (Story: StoryFn) => {
  return (
    <SessionProvider
      session={{ user: { id: '1234', address: '0x1234' }, expires: 'never' }}
    >
      <Story />
    </SessionProvider>
  );
};

export const ReactQueryDecorator = (Story: StoryFn) => {
  return (
    <ReactQueryProviders>
      <Story />
    </ReactQueryProviders>
  );
};
