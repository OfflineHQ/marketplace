'use client';

import { SessionProvider } from 'next-auth/react';

import { Session } from 'next-auth';
import React, { createContext, useContext } from 'react';
import { useSafeAuth, type UseSafeAuthProps } from './safeAuthSetup';
// eslint-disable-next-line import/no-unresolved
import '@next/types';

interface AuthProviderProps extends UseSafeAuthProps {
  children?: React.ReactNode;
  session: Session | null;
  isConnected?: () => boolean;
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
  safeAuth: ReturnType<typeof useSafeAuth>['safeAuth'];
  safeUser: ReturnType<typeof useSafeAuth>['safeUser'];
  provider: ReturnType<typeof useSafeAuth>['provider'];
  login: ReturnType<typeof useSafeAuth>['login'];
  logout: ReturnType<typeof useSafeAuth>['logout'];
  loginSiwe: ReturnType<typeof useSafeAuth>['loginSiwe'];
  logoutSiwe: ReturnType<typeof useSafeAuth>['logoutSiwe'];
  connecting: ReturnType<typeof useSafeAuth>['connecting'];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  const [context, setContext] = React.useState<AuthContextValue | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const fetchAuthContext = async () => {
      if (
        process.env.NEXT_PUBLIC_PLAYWRIGHT &&
        typeof window !== 'undefined' &&
        window.useE2EAuthContext
      ) {
        const e2eAuthContextString = await window.useE2EAuthContext();
        const e2eAuthContext = JSON.parse(e2eAuthContextString);
        setContext(e2eAuthContext);
      }
    };

    fetchAuthContext();
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
  const { safeAuth, ...props } = useSafeAuth({
    messages,
    session,
    isConnected,
  });

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
