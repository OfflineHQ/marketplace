import type { Meta, StoryObj } from '@storybook/react';

import { EventPasses, EventPassesSkeleton } from './EventPasses';
import { EventPassesExample, eventPassesProps } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof EventPasses> = {
  component: EventPasses,
  args: eventPassesProps,
  render: EventPassesExample,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof EventPasses>;

export const Default: Story = {
  render: EventPassesExample,
};

export const Skeleton: Story = {
  render: () => <EventPassesSkeleton />,
};

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
