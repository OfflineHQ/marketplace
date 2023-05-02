'use client';

import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { SessionProvider } from 'next-auth/react';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSafeAuth } from '@web/lib/safeAuthSetup';
// import { SSXProvider as _SSXProvider } from '@spruceid/ssx-react';
// eslint-disable-next-line import/no-unresolved
// import { SSXNextAuthRouteConfig } from '@spruceid/ssx-react/next-auth/frontend';
import { SafeAuthKit } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';

type IAppProviderProps = {
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
  web3AuthAdapter: ReturnType<typeof useSafeAuth>['web3AuthAdapter'];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC = ({ children }: IAppProviderProps) => {
  const connectedHandler = (data: any) => console.log('CONNECTED', data);
  const disconnectedHandler = (data: any) => console.log('DISCONNECTED', data);
  const { safeAuth, web3AuthAdapter } = useSafeAuth(
    connectedHandler,
    disconnectedHandler
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (safeAuth && web3AuthAdapter) {
      setLoading(false);
    }
  }, [safeAuth, web3AuthAdapter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ safeAuth, web3AuthAdapter }}>
      {children}
    </AuthContext.Provider>
  );
};
