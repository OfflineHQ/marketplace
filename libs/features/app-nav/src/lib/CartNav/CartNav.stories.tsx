import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { CartNav } from './CartNav';
import { CartNavDemo, cartNavProps } from './examples';

const meta = {
  component: CartNav,
  render: (props) => CartNavDemo(props),
  args: cartNavProps,
} satisfies Meta<typeof CartNav>;

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
    userEvent.click(await screen.findByText(/cart/i));
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

export const CartLoading: Story = {
  args: {
    isLoading: true,
  },
};
