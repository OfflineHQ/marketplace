import * as walletApi from '@next/wallet';
import {
  WalletProvider,
  useWalletAuth,
  useWalletConnect,
  useWalletContext,
} from '@next/wallet';
import { Text } from '@ui/components';
import * as nextIntl from 'next-intl';
import React from 'react';
import { createMock } from 'storybook-addon-module-mock';
import { OffKeyGateSignIn } from '../OffKeyGateSignIn/OffKeyGateSignIn';
import { OffKeyHeader } from '../OffKeyHeader/OffKeyHeader';
import { OffKeyLayout } from '../OffKeyLayout/OffKeyLayout';
import { OffKeyAuth } from './OffKeyAuth';

export function OffKeyAuthDemo() {
  return (
    <WalletProvider>
      <OffKeyLayout
        header={<OffKeyHeader title={<Text variant="h6">title</Text>} />}
      >
        <OffKeyGateSignIn gateId="gateId" />
        <OffKeyAuth />
      </OffKeyLayout>
    </WalletProvider>
  );
}

export function authMocks({
  walletAuthMocks,
  walletConnectMocks,
  walletContextMocks,
}: {
  walletAuthMocks: ReturnType<typeof useWalletAuth>;
  walletConnectMocks: ReturnType<typeof useWalletConnect>;
  walletContextMocks: ReturnType<typeof useWalletContext>;
}) {
  const mockWallet = createMock(walletApi, 'useWalletAuth');

  mockWallet.mockReturnValue(walletAuthMocks);
  const mockWalletContext = createMock(walletApi, 'useWalletContext');
  mockWalletContext.mockReturnValue(walletContextMocks);
  const mockWalletConnect = createMock(walletApi, 'useWalletConnect');
  mockWalletConnect.mockReturnValue(walletConnectMocks);

  const mockIntl = createMock(nextIntl, 'useLocale');
  mockIntl.mockReturnValue('en');
  return [
    // comethWallet,
    // connectAdaptor,
    mockIntl,
    mockWallet,
    mockWalletContext,
    mockWalletConnect,
  ];
}
