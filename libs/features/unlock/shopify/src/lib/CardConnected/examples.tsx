import * as kycApi from '@features/kyc-actions';
import * as walletApi from '@next/wallet';
import { WalletProvider, useWalletAuth, useWalletContext } from '@next/wallet';

import * as iframeApi from '@next/iframe';
import { useIframeConnect } from '@next/iframe';

import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';
import {
  ShopifyCardConnected,
  ShopifyCardConnectedProps,
} from './CardConnected';

export const CardConnectedExample = (props: ShopifyCardConnectedProps) => {
  return (
    <WalletProvider>
      <ShopifyCardConnected {...props} />
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
  const mockInitKyc = createMock(kycApi, 'initKyc');
  mockInitKyc.mockReturnValue({
    user: {},
    accessToken: 'accessToken',
  });
  const mockApplicantStatusChanged = createMock(
    kycApi,
    'handleApplicantStatusChanged',
  );
  mockApplicantStatusChanged.mockReturnValue(false);

  const mockIframeConnect = createMock(iframeApi, 'useIframeConnect');
  mockIframeConnect.mockReturnValue(useIframeConnectMocks);

  const mockIntl = createMock(nextIntl, 'useLocale');
  mockIntl.mockReturnValue('en');
  return [
    mockIntl,
    mockInitKyc,
    mockIframeConnect,
    mockApplicantStatusChanged,
    mockWallet,
    mockWalletContext,
  ];
}
