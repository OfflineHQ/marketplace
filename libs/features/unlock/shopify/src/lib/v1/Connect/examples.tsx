import * as walletApi from '@next/wallet';
import { WalletProvider, useWalletAuth } from '@next/wallet';
import { shopifyCustomerMocks as shopifyMocks } from '../../OffKeyHeaderNotConnected/examples';

import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import type { useShopifyCustomer } from '../../hooks/useShopifyCustomer';
import { V1Connect } from './Connect';

export function ConnectDemo() {
  return (
    <WalletProvider>
      <V1Connect />
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

export const customer = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
};

export const shopifyContext = {
  customerFirstName: customer.firstName,
  customerLastName: customer.lastName,
  customerEmail: customer.email,
  productTitle: 'My Product',
  productAvailable: true,
};
