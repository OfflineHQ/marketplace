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
import { AppContainer } from '../AppContainer/AppContainer';
import { Auth } from './Auth';

export const AuthExample = () => {
  return (
    <AppContainer>
      <WalletProvider>
        <Auth />
      </WalletProvider>
    </AppContainer>
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
