'use client';

import { SessionProvider } from 'next-auth/react';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSafeAuth } from '@web/lib/safeAuthSetup';

type IAppProviderProps = {
  children?: React.ReactNode;
};

interface INextAuthProps {
  children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: INextAuthProps) => {
  return <SessionProvider refetchInterval={0}>{children}</SessionProvider>;
};

export type SafeUser = ReturnType<typeof useSafeAuth>['safeUser'];

interface AuthContextValue {
  safeAuth: ReturnType<typeof useSafeAuth>['safeAuth'];
  safeAuthSignInResponse: ReturnType<typeof useSafeAuth>['safeAuthSignInResponse'];
  safeUser: SafeUser;
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
