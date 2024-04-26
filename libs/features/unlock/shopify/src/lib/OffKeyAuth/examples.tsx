import * as walletApi from '@next/wallet';
import { WalletProvider, useWalletAuth } from '@next/wallet';
import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import OffKeyGateSignIn from '../OffKeyGateSignIn/OffKeyGateSignIn';
import { offKeyGateSignInProps } from '../OffKeyGateSignIn/examples';
import OffKeyHeaderNotConnected from '../OffKeyHeaderNotConnected/OffKeyHeaderNotConnected';
import {
  offKeyHeaderNotConnectedProps,
  shopifyCustomerMocks as shopifyMocks,
} from '../OffKeyHeaderNotConnected/examples';
import { OffKeyLayout } from '../OffKeyLayout/OffKeyLayout';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';
import OffKeyAuth, { OffKeyAuthProps } from './OffKeyAuth';

export const offKeyAuthProps: OffKeyAuthProps = {
  organizerId: 'organizerId',
  textAuth: {
    createNewAccount: 'Create new account',
    useExistingAccount: 'Use existing account',
    useAnotherAccount: 'Use another account',
    noMatchingAccount: {
      useExistingAccount: 'Connect my account',
      recoverMyAccount: 'Recover my account',
    },
    signIn: 'Sign in',
  },
  locale: 'en',
};

export function OffKeyAuthDemo(props: OffKeyAuthProps) {
  return (
    <WalletProvider>
      <OffKeyLayout
        header={<OffKeyHeaderNotConnected {...offKeyHeaderNotConnectedProps} />}
      >
        <OffKeyGateSignIn {...offKeyGateSignInProps} />
        <OffKeyAuth {...props} />
      </OffKeyLayout>
    </WalletProvider>
  );
}

export type AuthMocksParams = {
  shopifyCustomerMocks: ReturnType<typeof useShopifyCustomer>;
  walletAuthMocks: ReturnType<typeof useWalletAuth>;
};

export function authMocks({
  shopifyCustomerMocks,
  walletAuthMocks,
}: AuthMocksParams) {
  const mockWallet = createMock(walletApi, 'useWalletAuth');
  mockWallet.mockReturnValue(walletAuthMocks);
  return [shopifyMocks(shopifyCustomerMocks), mockWallet];
}
