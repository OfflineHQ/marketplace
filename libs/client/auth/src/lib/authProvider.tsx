'use client';

import { SessionProvider } from 'next-auth/react';

import React, { createContext, useContext } from 'react';
import { useSafeAuth, type UseSafeAuthProps } from './safeAuthSetup';

interface AuthProviderProps extends UseSafeAuthProps {
  children?: React.ReactNode;
}

interface INextAuthProps {
  children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: INextAuthProps) => {
  return <SessionProvider refetchInterval={0}>{children}</SessionProvider>;
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, messages }: AuthProviderProps) => {
  const { safeAuth, ...props } = useSafeAuth({ messages });

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
