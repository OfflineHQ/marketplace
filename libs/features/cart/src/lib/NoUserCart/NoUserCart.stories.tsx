import type { Meta, StoryObj } from '@storybook/react';

import { NoUserCart } from './NoUserCart';
import { NoUserCartExample } from './examples';

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

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
