import { expect } from '@storybook/jest';
import { StoryObj, type Meta } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import { OffKeyAuth } from './OffKeyAuth';
import { OffKeyAuthDemo, authMocks } from './examples';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
const meta = {
  component: OffKeyAuth,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  render: OffKeyAuthDemo,
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
} satisfies Meta<typeof OffKeyAuth>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectedUser: Story = {
  play: async ({ container }) => {
    screen.findByText(/Sign in/i);
    userEvent.click(await screen.findByText(/🌶/i));
    userEvent.click(await screen.findByText(/create new account/i));
    userEvent.click(await screen.findByText(/use existing account/i));
  },
};

export const ConnectedUserWithMoreAccount: Story = {
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
            isConnectedToDapp: true,
          },
          walletContextMocks: {
            walletInStorage: [{ address }, { address: '0x214123135' }],
            walletConnected: address,
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/create new account/i));
    userEvent.click(await screen.findByText(/use existing account/i));
    userEvent.click(await screen.findByText(/🌶/i));
    userEvent.click(await screen.findByText(/🐧/i));
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
            isConnecting: true,
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
            wallet: null,
            isReady: false,
            isConnecting: false,
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
            walletConnected: '',
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
    },
  },
  play: async ({ container }) => {
    expect(screen.queryByText(/account/i)).not.toBeInTheDocument();
  },
};

export const WithNoExistingWallet: Story = {
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
            isConnectedToDapp: false,
          },
          walletContextMocks: {
            walletConnected: '',
            wcUri: 'wc:fake',
            autoConnectAddress: '',
          },
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/create new account/i));
    userEvent.click(await screen.findByText(/use existing account/i));
  },
};
