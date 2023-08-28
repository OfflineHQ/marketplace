import type { Meta, StoryObj } from '@storybook/react';

import { SinglePass } from './SinglePass';
import { eventPassNft1, SinglePassNoUserExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof SinglePass> = {
  component: SinglePass,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    eventPassNft: eventPassNft1,
  },
} satisfies Meta<typeof SinglePass>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotRevealedPass: Story = {
  render: SinglePassNoUserExample,
};

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
