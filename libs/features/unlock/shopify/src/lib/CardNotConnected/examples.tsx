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
  ShopifyCardNotConnected,
  ShopifyCardNotConnectedProps,
} from './CardNotConnected';

export const CardNotConnectedExample = (
  props: ShopifyCardNotConnectedProps,
) => {
  return (
    <WalletProvider>
      <ShopifyCardNotConnected {...props} />
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
