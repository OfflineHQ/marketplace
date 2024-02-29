import * as kycApi from '@features/kyc-actions';
import * as walletApi from '@next/wallet';
import { expect, screen } from '@storybook/test';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import * as nextAuth from 'next-auth/react';
import * as nextIntl from 'next-intl';
import { createMock, getMock } from 'storybook-addon-module-mock';
import { Auth } from './Auth';
import { AuthExample } from './examples';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

const meta = {
  component: Auth,
  render: AuthExample,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () => {
        const mockSignIn = createMock(nextAuth, 'signIn');
        mockSignIn.mockReturnValue({ error: null });
        const mockSignOut = createMock(nextAuth, 'signOut');
        mockSignOut.mockReturnValue({});
        const mockWallet = createMock(walletApi, 'useWalletAuth');

        mockWallet.mockReturnValue({
          connect: () => Promise.resolve(),
          disconnect: () => Promise.resolve(),
          wallet: {
            getAddress: () => address,
            connected: true,
          },
        });
        const mockWalletContext = createMock(walletApi, 'useWalletContext');
        mockWalletContext.mockReturnValue({
          walletConnected: address,
          wcUri: 'wc:fake',
          autoConnectAddress: '',
        });
        const mockWalletConnect = createMock(walletApi, 'useWalletConnect');
        mockWalletConnect.mockReturnValue({
          initializeWalletConnect: () => Promise.resolve(),
          connectToDapp: () => Promise.resolve(),
          isReady: true,
          loading: false,
          isLoadingApprove: false,
        });
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
          mockSignIn,
          mockSignOut,
          mockIntl,
          mockInitKyc,
          mockApplicantStatusChanged,
          mockWallet,
          mockWalletContext,
          mockWalletConnect,
        ];
      },
    },
  },
} satisfies Meta<typeof Auth>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UserConnectedWithWalletConnect: Story = {
  play: async ({ container }) => {
    expect(
      screen.queryByRole('button', {
        name: /Login/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Logout/i,
      }),
    ).toBeInTheDocument();
    screen.getByText('WalletConnect');
  },
};

export const UserConnectedNoWalletConnect: Story = {
  args: {
    wcUri: '',
  },
  play: async ({ parameters }) => {
    const mockWalletConnect = getMock(
      parameters,
      walletApi,
      'useWalletConnect',
    );
    // mockWalletConnect.mockResolvedValueOnce({

    // })
  },
};
