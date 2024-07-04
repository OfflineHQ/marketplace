import { StoryObj, type Meta } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import { ShopifyCustomerStatus } from '../../types';
import { V1Connect } from './Connect';
import {
  ConnectDemo,
  additionalData,
  authMocks,
  customer,
  shopifyContext,
} from './examples';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

const walletConnectedProps = {
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
};

const meta = {
  component: V1Connect,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  render: ConnectDemo,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: null,
            customer: null,
            walletInStorage: [{ address }, { address: '0x214123135' }],
            shopifyContext,
            additionalData,
          },
          ...walletConnectedProps,
        }),
    },
  },
} satisfies Meta<typeof V1Connect>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const NotConnected: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: ShopifyCustomerStatus.NotConnected,
            customer: null,
            walletInStorage: [{ address }, { address: '0x214123135' }],
            shopifyContext,
            additionalData,
          },
          ...walletConnectedProps,
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/connect to my account/i));
  },
};

export const NewAccount: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: ShopifyCustomerStatus.NewAccount,
            customer,
            walletInStorage: [],
            shopifyContext,
            additionalData,
          },
          ...walletConnectedProps,
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/create new account/i));
    userEvent.click(await screen.findByText(/use existing account/i));
  },
};

export const ExistingAccountNewCustomer: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: ShopifyCustomerStatus.ExistingAccountNewCustomer,
            customer,
            walletInStorage: [{ address }],
            shopifyContext,
            additionalData,
          },
          ...walletConnectedProps,
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/connect/i));
  },
};

export const MatchingAccount: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: ShopifyCustomerStatus.MatchingAccount,
            customer,
            walletInStorage: [{ address }, { address: '0x214123135' }],
            walletToConnect: address,
            shopifyContext,
            additionalData,
          },
          ...walletConnectedProps,
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/connect/i));
  },
};

export const NoMatchingAccount: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: ShopifyCustomerStatus.NoMatchingAccount,
            customer,
            walletInStorage: [{ address }, { address: '0x214123135' }],
            walletToConnect: '0x123456789',
            shopifyContext,
            additionalData,
          },
          ...walletConnectedProps,
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/🌿/i));
  },
};
