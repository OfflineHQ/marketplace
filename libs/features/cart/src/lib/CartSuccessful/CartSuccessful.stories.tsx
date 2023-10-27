import type { Meta, StoryObj } from '@storybook/react';

import { CartSuccessful } from './CartSuccessful';
import {
  CartSuccessfulExample,
  passOrder1,
  passOrder2,
  passOrderWithEvent2,
} from './examples';

const meta: Meta<typeof CartSuccessful> = {
  render: CartSuccessfulExample,
  component: CartSuccessful,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    passes: [passOrder1, passOrder2],
  },
};

export default meta;

type Story = StoryObj<typeof CartSuccessful>;

export const Default: Story = {};

export const WithSeveralEvents: Story = {
  args: {
    passes: [passOrder1, passOrder2, passOrderWithEvent2],
  },
};
