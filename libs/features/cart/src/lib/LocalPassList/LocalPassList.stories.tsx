import type { Meta, StoryObj } from '@storybook/react';

import { LocalPassList } from './LocalPassList';
import { LocalPassListExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof LocalPassList> = {
  component: LocalPassList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof LocalPassList>;

export const Default: Story = {
  render: LocalPassListExample,
};

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
