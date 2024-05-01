import { WalletProvider } from '@next/wallet';

import * as iframeApi from '@next/iframe';
import { useIframeConnect } from '@next/iframe';

import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import {
  customer,
  authMocks as offKeyAuthMocks,
  shopifyContext,
  type AuthMocksParams,
} from '../OffKeyAuth/examples';
import { ShopifyCustomerStatus } from '../types';
import OffKeyProfile, { OffKeyProfileProps } from './OffKeyProfile';

export const OffKeyProfileExample = (props: OffKeyProfileProps) => {
  return (
    <WalletProvider>
      <div className="flex">
        <OffKeyProfile {...props} />
      </div>
    </WalletProvider>
  );
};

export const offKeyProfileProps: OffKeyProfileProps = {
  organizerId: '1',
  user: {
    id: '1',
    address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
  },
  textProfile: {
    myAccount: 'My Account',
    signOut: 'Sign Out',
  },
  locale: 'en',
};

export const shopifyCustomerMatchingAccount = {
  customer,
  status: ShopifyCustomerStatus.MatchingAccount,
  walletInStorage: [{ address: offKeyProfileProps.user.address }],
  offKeyState: null,
  shopifyContext,
};

interface OffKeyProfileMocks extends AuthMocksParams {
  useIframeConnectMocks: ReturnType<typeof useIframeConnect>;
}

export function authMocks({
  useIframeConnectMocks,
  ...props
}: OffKeyProfileMocks) {
  const mockIframeConnect = createMock(iframeApi, 'useIframeConnect');
  mockIframeConnect.mockReturnValue(useIframeConnectMocks);

  return [...offKeyAuthMocks(props), mockIframeConnect];
}
