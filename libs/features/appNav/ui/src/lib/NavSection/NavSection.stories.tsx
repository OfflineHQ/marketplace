import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';
import { NavSection } from './NavSection';
import { Cart as CartIcon, QrCode } from '@ui/icons';
import { NavSectionDemo, cartNavProps } from './examples';

const meta = {
  component: NavSection,
  render: (props) => NavSectionDemo(props, CartIcon, 'Cart'),
  args: cartNavProps,
} satisfies Meta<typeof NavSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cart: Story = {};

export const CartActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/cart',
      },
    },
  },
};

export const CartWithHelperText: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('Cart'));
    // Check that the helper text is present
    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes('Go to your cart')
      );
    });
  },
};

export const CartWithPing: Story = {
  args: {
    ping: { isActive: true },
  },
};

export const CartWithPingAndNumber: Story = {
  args: {
    ping: { isActive: true, number: 3 },
  },
};

export const Pass: Story = {
  render: (props) => NavSectionDemo(props, QrCode, 'Pass'),
  args: {
    helperText: 'Go to your passes',
    href: '/pass',
  },
};

export const PassWithPing: Story = {
  ...Pass,
  args: {
    ping: { isActive: true },
  },
};
