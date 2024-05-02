'use client';

import { SessionProvider } from 'next-auth/react';

import { Session } from 'next-auth';
import React, { createContext, useContext } from 'react';
import { useSafeAuth, type UseSafeAuthProps } from './safeAuthSetup';
// eslint-disable-next-line import/no-unresolved
import '@next/types';

interface AuthProviderProps extends UseSafeAuthProps {
  children?: React.ReactNode;
}

interface INextAuthProps {
  children: React.ReactNode;
  session: Session | null;
}

export const NextAuthProvider = ({ children, session }: INextAuthProps) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
};

interface AuthContextValue {
  login: ReturnType<typeof useSafeAuth>['login'];
  logout: ReturnType<typeof useSafeAuth>['logout'];
  createAccount: ReturnType<typeof useSafeAuth>['createAccount'];
  loginAuto: ReturnType<typeof useSafeAuth>['loginAuto'];
  connecting: ReturnType<typeof useSafeAuth>['connecting'];
  isReady: ReturnType<typeof useSafeAuth>['isReady'];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  const [context, setContext] = React.useState<AuthContextValue | undefined>(
    undefined,
  );
  React.useEffect(() => {
    const testAuthContext = async () => {
      // here mean we are in e2e test so bypass the auth part
      if (window?.useE2EAuthContext && process.env.NEXT_PUBLIC_E2E_TEST) {
        const e2eAuthContextString = await window.useE2EAuthContext();
        const e2eAuthContext = JSON.parse(e2eAuthContextString);
        setContext(e2eAuthContext);
      }
    };

    testAuthContext();
  }, []);

  if (!authContext) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context ? context : authContext;
};

export const AuthProvider = ({
  children,
  messages,
  session,
  isConnected,
}: AuthProviderProps) => {
  const props = useSafeAuth({
    messages,
    session,
    isConnected,
  });

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
};
