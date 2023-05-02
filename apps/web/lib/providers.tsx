'use client';

import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { SessionProvider } from 'next-auth/react';
import { SSXProvider as _SSXProvider } from '@spruceid/ssx-react';
// eslint-disable-next-line import/no-unresolved
import { SSXNextAuthRouteConfig } from '@spruceid/ssx-react/next-auth/frontend';

type Props = {
  children?: React.ReactNode;
};

interface INextAuthProps {
  children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: INextAuthProps) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
};

export const SSXProvider = ({ children }: Props) => {
  const { server } = SSXNextAuthRouteConfig({
    signInOptions: { callbackUrl: '/protected' },
  });
  const ssxConfig: any = {
    siweConfig: {
      domain: 'localhost:3000',
    },
    providers: {
      server,
    },
  };

  return <_SSXProvider ssxConfig={ssxConfig}>{children}</_SSXProvider>;
};

const { provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

export const WagmiProvider = ({ children }: Props) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
);
