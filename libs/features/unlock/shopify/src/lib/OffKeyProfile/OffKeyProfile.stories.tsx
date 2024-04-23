import { expect, screen, userEvent, waitFor } from '@storybook/test';
import OffKeyProfile from './OffKeyProfile';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import { OffKeyProfileExample, authMocks } from './examples';

import { ConnectStatus } from '@next/iframe';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
const meta = {
  component: OffKeyProfile,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  parameters: {
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
          walletContextMocks: {
            walletConnected: address,
            autoConnectAddress: '',
          },
          useIframeConnectMocks: {
            connectStatus: ConnectStatus.CONNECTED,
            disconnectFromDapp: () => Promise.resolve(),
            signWithEthereum: () => Promise.resolve(),
            askForWalletConnectStatus: () => Promise.resolve(),
          },
        }),
    },
  },
  args: {
    user: {
      id: '1',
      address,
    },
  },
  render: OffKeyProfileExample,
} satisfies Meta<typeof OffKeyProfile>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectedUser: Story = {
  play: async ({ container }) => {
    const profileButton = await screen.findAllByText('🌶');
    await userEvent.click(profileButton[0]);
    await waitFor(() => screen.queryByText(/sign out/i));
  },
};

export const UserConnecting: Story = {
  args: {},
  parameters: {
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
          walletContextMocks: {
            walletConnected: address,
            autoConnectAddress: '',
          },
          useIframeConnectMocks: {
            connectStatus: ConnectStatus.CONNECTING,
            disconnectFromDapp: () => Promise.resolve(),
            signWithEthereum: () => Promise.resolve(),
            askForWalletConnectStatus: () => Promise.resolve(),
          },
        }),
    },
  },
  play: async ({ container }) => {
    expect(await screen.findByRole('status')).toBeInTheDocument();
  },
};

export const SettingUpWallet: Story = {
  parameters: {
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
            isReady: false,
            isConnecting: true,
          },
          walletContextMocks: {
            walletConnected: address,
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
          useIframeConnectMocks: {
            connectStatus: ConnectStatus.CONNECTED,
            disconnectFromDapp: () => Promise.resolve(),
            signWithEthereum: () => Promise.resolve(),
            askForWalletConnectStatus: () => Promise.resolve(),
          },
        }),
    },
  },
  play: async ({ container }) => {
    expect(screen.queryByText(/My Account/i)).not.toBeInTheDocument();
  },
};
