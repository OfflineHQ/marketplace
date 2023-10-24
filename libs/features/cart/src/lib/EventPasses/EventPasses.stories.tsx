import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

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

export const Default: Story = {};

export const Opened: Story = {
  play: async () => {
    const accordionTrigger = await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    accordionTrigger.click();
    await screen.findByText(/1 x/i);
    await screen.findByText(/General Admission/i);
    await screen.findByText(/2 x/i);
    await screen.findByText(/VIP Pass/i);
    userEvent.click(
      screen.getByRole('button', {
        name: /Edit/i,
      }),
    );
    userEvent.click(
      screen.getByRole('button', {
        name: /Delete/i,
      }),
    );
  },
};

export const Skeleton: Story = {
  render: () => <EventPassesSkeleton />,
};
