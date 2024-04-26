import { StoryObj, type Meta } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
import { ShopifyCustomerStatus } from '../types';
import OffKeyAuth from './OffKeyAuth';
import { OffKeyAuthDemo, authMocks, offKeyAuthProps } from './examples';

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';

const customer = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
};

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
  component: OffKeyAuth,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  render: OffKeyAuthDemo,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: null,
            customer: null,
            walletInStorage: [{ address }, { address: '0x214123135' }],
          },
          ...walletConnectedProps,
        }),
    },
  },
  args: offKeyAuthProps,
} satisfies Meta<typeof OffKeyAuth>;
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
          },
          ...walletConnectedProps,
        }),
    },
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
          },
          ...walletConnectedProps,
        }),
    },
  },
  play: async ({ container }) => {
    screen.findByText(/Sign in/i);
    userEvent.click(await screen.findByText(/🌶/i));
    userEvent.click(await screen.findByText(/create new account/i));
    userEvent.click(await screen.findByText(/use another account/i));
  },
};

export const ExistingSeveralAccountNewCustomer: Story = {
  parameters: {
    moduleMock: {
      mock: () =>
        authMocks({
          shopifyCustomerMocks: {
            status: ShopifyCustomerStatus.ExistingAccountNewCustomer,
            customer,
            walletInStorage: [{ address }, { address: '0x214123135' }],
          },
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
        }),
    },
  },
  play: async ({ container }) => {
    userEvent.click(await screen.findByText(/create new account/i));
    userEvent.click(await screen.findByText(/use another account/i));
    userEvent.click(await screen.findByText(/🌶/i));
    userEvent.click(await screen.findByText(/🦩/i));
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
          },
          ...walletConnectedProps,
        }),
    },
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
          },
          ...walletConnectedProps,
        }),
    },
  },
};
