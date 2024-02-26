import { AuthProvider, NextAuthProvider } from '@next/auth';
import { WalletProvider } from '@next/wallet';
import React from 'react';
import { Auth } from './Auth';
import { AppContainer } from '../AppContainer/AppContainer';

export const AuthExample = () => {
  return (
    <AppContainer>
      <WalletProvider>
        <NextAuthProvider session={null}>
          <AuthProvider session={null} isConnected={() => true}>
            <Auth />
          </AuthProvider>
        </NextAuthProvider>
      </WalletProvider>
    </AppContainer>
  );
};
