import type { Meta, StoryObj } from '@storybook/react';

import { NoUserCart } from './NoUserCart';
import {
  NoUserCartExample,
  NoUserCartLoadingExample,
  NoUserCartNoCartExample,
} from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof NoUserCart> = {
  component: NoUserCart,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof NoUserCart>;

export const SectionWithNoUser: Story = {
  render: NoUserCartExample,
};

export const SectionWithNoUserLoading: Story = {
  render: NoUserCartLoadingExample,
};

export const SectionWithNoUserNoCart: Story = {
  render: NoUserCartNoCartExample,
};
