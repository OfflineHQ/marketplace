'use client';

import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { SessionProvider } from 'next-auth/react';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSafeAuth } from '@web/lib/safeAuthSetup';
// import { SSXProvider as _SSXProvider } from '@spruceid/ssx-react';
// eslint-disable-next-line import/no-unresolved
// import { SSXNextAuthRouteConfig } from '@spruceid/ssx-react/next-auth/frontend';

type IAppProviderProps = {
  children?: React.ReactNode;
};

interface INextAuthProps {
  children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: INextAuthProps) => {
  return <SessionProvider refetchInterval={0}>{children}</SessionProvider>;
};

// export const SSXProvider = ({ children }: IAppProviderProps) => {
//   const { server } = SSXNextAuthRouteConfig({
//     signInOptions: { callbackUrl: '/protected' },
//   });
//   const ssxConfig: any = {
//     siweConfig: {
//       domain: 'localhost:3000',
//     },
//     providers: {
//       server,
//     },
//   };

//   return <_SSXProvider ssxConfig={ssxConfig}>{children}</_SSXProvider>;
// };

const { provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

export const WagmiProvider = ({ children }: IAppProviderProps) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
);

interface AuthContextValue {
  safeAuth: ReturnType<typeof useSafeAuth>['safeAuth'];
  safeAuthSignInResponse: ReturnType<typeof useSafeAuth>['safeAuthSignInResponse'];
  userInfo: ReturnType<typeof useSafeAuth>['userInfo'];
  provider: ReturnType<typeof useSafeAuth>['provider'];
  login: ReturnType<typeof useSafeAuth>['login'];
  logout: ReturnType<typeof useSafeAuth>['logout'];
  loginSiwe: ReturnType<typeof useSafeAuth>['loginSiwe'];
  logoutSiwe: ReturnType<typeof useSafeAuth>['logoutSiwe'];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: IAppProviderProps) => {
  const connectedHandler = async (data: any) => {
    console.log('CONNECTED', data);
  };
  const disconnectedHandler = (data: any) => console.log('DISCONNECTED', data);
  const { safeAuth, ...props } = useSafeAuth(connectedHandler, disconnectedHandler);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (safeAuth) {
      setLoading(false);
    }
  }, [safeAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        safeAuth,
        ...props,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
