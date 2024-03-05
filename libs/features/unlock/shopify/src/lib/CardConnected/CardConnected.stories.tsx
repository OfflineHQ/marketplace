import { expect, screen, userEvent } from '@storybook/test';
import { ShopifyCardConnected } from './CardConnected';
// import * as walletHook from '@next/wallet';
import { StoryObj, type Meta } from '@storybook/react';

import {
  ReactQueryDecorator,
  ToasterDecorator,
} from '@test-utils/storybook-decorators';
const meta = {
  component: ShopifyCardConnected,
  decorators: [ToasterDecorator, ReactQueryDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
  args: {
    children: 'children',
    user: {
      id: '1',
      address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
    },
  },
} satisfies Meta<typeof ShopifyCardConnected>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectedUser: Story = {
  play: async ({ container }) => {
    userEvent.click(screen.getByText(/My Account/i));
    expect(await screen.findByText(/sign-out/i)).toBeInTheDocument();
  },
};

export const UserConnecting: Story = {
  args: {
    isLoading: true,
  },
  play: async ({ container }) => {
    expect(await screen.findByRole('status')).toBeInTheDocument();
  },
};
