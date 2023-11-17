'use client';

import { SessionProvider } from 'next-auth/react';

import env from '@env/client';
import { Session } from 'next-auth';
import React, { createContext, useContext } from 'react';
import { useSafeAuth, type UseSafeAuthProps } from './safeAuthSetup';

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
  const context = useContext(AuthContext);
  console.log({ PLAYWRIGHT: env.NEXT_PUBLIC_PLAYWRIGHT });
  console.log({ Data: window.ethereum });
  if (env.NEXT_PUBLIC_PLAYWRIGHT) {
    return {
      safeUser: {
        email: 'alpha_user@test.io',
        eoa: '0xb1A6D06913695CF31262D42a1e39E19ca9f2121d',
        idToken:
          'eyJhbGciOiJSUzI1NiJ9.eyJyb2xlIjoidXNlciIsInByb3ZpZGVyIjoiY3JlZGVudGlhbHMiLCJwcm92aWRlclR5cGUiOiJjcmVkZW50aWFscyIsInVzZXIiOnsiaWQiOiI2NzlmOTJkNi1hMDFlLTRhYjctOTNmOC0xMDg0MGQyMmIwYTUiLCJhZGRyZXNzIjoiMHhCOThiRDdDN2Y2NTYyOTAwNzFFNTJEMWFBNjE3RDljQjQ0NjdGZDZEIiwiZW1haWwiOiJhbHBoYV91c2VyQHRlc3QuaW8iLCJreWMiOnsiYXBwbGljYW50SWQiOiI2NTUzNmFlYTBkMzY3YTY1ZjRlMTAwZTAiLCJyZXZpZXdTdGF0dXMiOiJjb21wbGV0ZWQiLCJsZXZlbE5hbWUiOiJiYXNpY19reWNfbGV2ZWwifX19.i88bfias5-WY1_uAhEnFZrLheS9g-tMesKaNffKBsqTxWe-q1x6OErWiwZDuCx-TUvtWH2i1mawiON9jPLV5xRK_wFRo0ukWukPkb0t7v-z0e0uBX1a0c-y1HFsS92NMCXSsyqFZmBLpuA2HyvRaGkn4vLW5IFXfFzVg6827q9ms-OlKCgxRZei3UU25NsNWR0vxND-rq4xIwXSljzhfpiKjpLXu-mpt096Fp4clcK23ITGjzUkaJq5yhFMtpFoaHMb7haGzC4wrxpVFa2zKt4ACxuehNP6u__wCSHVKBFqguVoSGrvq664ZFsBjvqJzcNqUex62pnfoGTNvBEBFQA',
        isMfaEnabled: false,
        name: 'Alpha User',
        profileImage:
          'https://i.kym-cdn.com/photos/images/newsfeed/001/841/359/e7c.png',
        safes: [],
        typeOfLogin: 'email',
        verifier: 'web3auth',
        verifierId: 'alpha_user@test.io',
      },
      login: async () => {
        console.log('Login method called');
      },
      logout: async () => {
        console.log('Logout method called');
      },
      safeAuth: true,
      connecting: false,
    };
  }
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
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
