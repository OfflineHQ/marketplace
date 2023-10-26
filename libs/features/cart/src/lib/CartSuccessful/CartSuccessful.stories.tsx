import type { Meta, StoryObj } from '@storybook/react';

import { CartSuccessful } from './CartSuccessful';
import { CartSuccessfulExample } from './examples';

const meta: Meta<typeof CartSuccessful> = {
  render: CartSuccessfulExample,
  component: CartSuccessful,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof CartSuccessful>;

export const Default: Story = {};
