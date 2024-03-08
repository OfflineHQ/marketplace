import { expect, screen, userEvent } from '@storybook/test';
import { ShopifyCardConnected } from './CardConnected';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import { CardConnectedExample, authMocks } from './examples';

import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
const meta = {
  component: ShopifyCardConnected,
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
            isConnectedToDapp: true,
          },
          walletContextMocks: {
            walletConnected: address,
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
    },
  },
  args: {
    children: 'children',
    user: {
      id: '1',
      address,
    },
  },
  render: CardConnectedExample,
} satisfies Meta<typeof ShopifyCardConnected>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectedUser: Story = {
  play: async ({ container }) => {
    userEvent.click(screen.getByText(/My Account/i));
    expect(await screen.findByText(/sign out/i)).toBeInTheDocument();
  },
};

export const UserConnecting: Story = {
  args: {
    isLoading: true,
  },
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
          walletConnectMocks: {
            initializeWalletConnect: () => Promise.resolve(),
            connectToDapp: () => Promise.resolve(),
            isReady: true,
            loading: false,
            isLoadingApprove: false,
            isConnectedToDapp: false,
          },
          walletContextMocks: {
            walletConnected: address,
            wcUri: 'wc:fake',
            autoConnectAddress: '',
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
          walletConnectMocks: {
            initializeWalletConnect: () => Promise.resolve(),
            connectToDapp: () => Promise.resolve(),
            isReady: false,
            loading: false,
            isLoadingApprove: false,
            isConnectedToDapp: false,
          },
          walletContextMocks: {
            walletConnected: address,
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
    },
  },
  play: async ({ container }) => {
    expect(screen.queryByText(/My Account/i)).not.toBeInTheDocument();
  },
};
