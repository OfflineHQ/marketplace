'use client';

import { SessionProvider } from 'next-auth/react';
import { SSXProvider as _SSXProvider } from '@spruceid/ssx-react';
// eslint-disable-next-line import/no-unresolved
import { SSXNextAuthRouteConfig } from '@spruceid/ssx-react/next-auth/frontend';

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
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
