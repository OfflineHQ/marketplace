import { expect, screen } from '@storybook/test';
import OffKeyHeaderNotConnected from './OffKeyHeaderNotConnected';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';

import { ReactQueryDecorator } from '@test-utils/storybook-decorators';
import { ShopifyCustomerStatus } from '../types';
import {
  offKeyHeaderNotConnectedProps,
  shopifyCustomerMocks,
} from './examples';

const meta = {
  component: OffKeyHeaderNotConnected,
  decorators: [ReactQueryDecorator],
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () => [
        shopifyCustomerMocks({
          status: null,
          customer: null,
        }),
      ],
    },
  },
  args: offKeyHeaderNotConnectedProps,
} satisfies Meta<typeof OffKeyHeaderNotConnected>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const WithNoCustomer: Story = {
  parameters: {
    moduleMock: {
      mock: () => [
        shopifyCustomerMocks({
          status: ShopifyCustomerStatus.NotConnected,
          customer: null,
        }),
      ],
    },
  },
  play: async ({ container }) => {
    expect(screen.getByText(/Connect to your account/i)).toBeInTheDocument();
  },
};

export const WithCustomer: Story = {
  parameters: {
    moduleMock: {
      mock: () => [
        shopifyCustomerMocks({
          status: ShopifyCustomerStatus.NewAccount,
          customer: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@doe.com',
          },
        }),
      ],
    },
  },
  play: async ({ container }) => {
    expect(await screen.findByText(/Hello John!/i)).toBeInTheDocument();
  },
};

export const WithCustomerEmail: Story = {
  ...WithCustomer,
  play: async ({ container }) => {
    expect(await screen.findByText(/Hello john@doe.com!/i)).toBeInTheDocument();
  },
  args: {
    textHeaderNotConnected: {
      ...offKeyHeaderNotConnectedProps.textHeaderNotConnected,
      customerConnected: 'Hello {email}!',
    },
  },
};
