import * as walletApi from '@next/wallet';
import { expect, screen } from '@storybook/test';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import { getMock } from 'storybook-addon-module-mock';
import { Auth } from './Auth';
import { AuthExample, authMocks } from './examples';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

const meta = {
  component: Auth,
  render: AuthExample,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () =>
        authMocks({
          walletAuthMocks: {
            connect: () => Promise.resolve(),
            disconnect: () => Promise.resolve(),
            wallet: {
              getAddress: () => address,
              connected: true,
            },
            isReady: true,
            isConnecting: false,
          },
          walletConnectMocks: {
            initializeWalletConnect: () => Promise.resolve(),
            connectToDapp: () => Promise.resolve(),
            isReady: true,
            loading: false,
            isLoadingApprove: false,
          },
          walletContextMocks: {
            walletConnected: address,
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
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

export const UserCreateAccount: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          walletAuthMocks: {
            connect: () => Promise.resolve(),
            disconnect: () => Promise.resolve(),
            wallet: null,
            isReady: true,
            isConnecting: false,
          },
          walletConnectMocks: {
            initializeWalletConnect: () => Promise.resolve(),
            connectToDapp: () => Promise.resolve(),
            isReady: true,
            loading: false,
            isLoadingApprove: false,
          },
          walletContextMocks: {
            walletConnected: '',
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
    },
  },
  play: async ({ parameters }) => {
    expect(
      screen.queryByRole('button', {
        name: /Create account/i,
      }),
    ).toBeInTheDocument();
  },
};
