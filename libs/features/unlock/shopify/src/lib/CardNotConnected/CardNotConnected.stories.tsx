import { expect, screen, userEvent } from '@storybook/test';
import { ShopifyCardNotConnected } from './CardNotConnected';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';
import { CardNotConnectedExample, authMocks } from './examples';

import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import { mobileMode } from '@test-utils/storybook-modes';
import React from 'react';
import { firstKey, secondKey } from '../KeyRequired/examples';
import { KeysRequired } from '../KeysRequired/KeysRequired';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
const meta = {
  component: ShopifyCardNotConnected,
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
    children: (
      <KeysRequired
        keys={[
          { ...firstKey, isOwned: true },
          { ...secondKey, isOwned: false },
        ]}
        separatorText="or"
      />
    ),
    user: {
      id: '1',
      address,
    },
  },
  render: CardNotConnectedExample,
} satisfies Meta<typeof ShopifyCardNotConnected>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectedUser: Story = {
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/🌶/i));
    // userEvent.click(await screen.findByText(/Sign in with/i));
  },
};

export const ConnectedUserOpenDialog: Story = {
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/Sign in with/i));
    expect(
      await screen.findByText(/Sign in with my account/i),
    ).toBeInTheDocument();
    userEvent.click((await screen.findAllByText(/Create an account/i))[1]);
  },
};

export const ConnectedUserWithMoreAccountOpenDialog: Story = {
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
    userEvent.click(await screen.findByText(/Sign in with/i));
    expect(
      await screen.findByText(/Sign in with my account/i),
    ).toBeInTheDocument();
    userEvent.click(await screen.findByText(/🐧/i));
  },
};

export const ConnectedUserWithMobile: Story = {
  ...ConnectedUser,
  parameters: {
    ...mobileMode,
  },
};

export const ConnectedUserWithOpenDrawer: Story = {
  ...ConnectedUserOpenDialog,
  parameters: {
    ...mobileMode,
  },
};

export const ConnectedUserWithMoreAccountOpenDrawerMobile: Story = {
  ...ConnectedUserWithMoreAccountOpenDialog,
  parameters: {
    ...mobileMode,
    ...ConnectedUserWithMoreAccountOpenDialog.parameters,
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
    expect(screen.queryByText(/My Account/i)).not.toBeInTheDocument();
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
    userEvent.click(await screen.findByText(/create an account/i));
    userEvent.click(await screen.findByText(/Sign in with my account/i));
  },
};
