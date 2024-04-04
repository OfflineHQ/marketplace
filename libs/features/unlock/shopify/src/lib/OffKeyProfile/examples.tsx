import * as walletApi from '@next/wallet';
import { WalletProvider, useWalletAuth, useWalletContext } from '@next/wallet';

import * as iframeApi from '@next/iframe';
import { useIframeConnect } from '@next/iframe';

import * as nextIntl from 'next-intl';
import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import { OffKeyProfile, OffKeyProfileProps } from './OffKeyProfile';

export const OffKeyProfileExample = (props: OffKeyProfileProps) => {
  return (
    <WalletProvider>
      <OffKeyProfile {...props} />
    </WalletProvider>
  );
};

export function authMocks({
  walletAuthMocks,
  walletContextMocks,
  useIframeConnectMocks,
}: {
  walletAuthMocks: ReturnType<typeof useWalletAuth>;
  walletContextMocks: ReturnType<typeof useWalletContext>;
  useIframeConnectMocks: ReturnType<typeof useIframeConnect>;
}) {
  const mockWallet = createMock(walletApi, 'useWalletAuth');

  mockWallet.mockReturnValue(walletAuthMocks);
  const mockWalletContext = createMock(walletApi, 'useWalletContext');
  mockWalletContext.mockReturnValue(walletContextMocks);
  const mockIframeConnect = createMock(iframeApi, 'useIframeConnect');
  mockIframeConnect.mockReturnValue(useIframeConnectMocks);

  const mockIntl = createMock(nextIntl, 'useLocale');
  mockIntl.mockReturnValue('en');
  return [mockIntl, mockWallet, mockWalletContext, mockIframeConnect];
}
