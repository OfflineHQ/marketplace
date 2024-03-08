import * as kycApi from '@features/kyc-actions';
import * as walletApi from '@next/wallet';
import {
  WalletProvider,
  useWalletAuth,
  useWalletConnect,
  useWalletContext,
} from '@next/wallet';
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
  const mockIntl = createMock(nextIntl, 'useLocale');
  mockIntl.mockReturnValue('en');
  return [
    // comethWallet,
    // connectAdaptor,
    mockIntl,
    mockInitKyc,
    mockApplicantStatusChanged,
    mockWallet,
    mockWalletContext,
    mockWalletConnect,
  ];
}
