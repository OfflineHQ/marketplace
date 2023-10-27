import type { Meta, StoryObj } from '@storybook/react';

import { CartCancelled } from './CartCancelled';
import {
  CartCancelledExample,
  passOrder1,
  passOrder2,
  passOrderWithEvent2,
} from './examples';

const meta: Meta<typeof CartCancelled> = {
  render: CartCancelledExample,
  component: CartCancelled,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    passes: [passOrder1, passOrder2],
  },
};

export default meta;

type Story = StoryObj<typeof CartCancelled>;

export const Default: Story = {};

export const WithSeveralEvents: Story = {
  args: {
    passes: [passOrder1, passOrder2, passOrderWithEvent2],
  },
};
