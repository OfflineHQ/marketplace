import type { Meta, StoryObj } from '@storybook/react';

import { NoUserPass } from './NoUserPass';
import { NoUserPassExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof NoUserPass> = {
  component: NoUserPass,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof NoUserPass>;

export const SectionWithNoUser: Story = {
  render: NoUserPassExample,
};

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
