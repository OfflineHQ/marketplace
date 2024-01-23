import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';

import { mobileMode } from '@test-utils/storybook';
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

export const OpenedWithNoTimeDeletion: Story = {
  play: async () => {
    const accordionTrigger = await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    accordionTrigger.click();
    await screen.findByText(/6 x/i);
    screen.getByText(/General Admission/i);
    await screen.findByText(/€1,237.86/i);
    screen.getByText(/3 x/i);
    screen.getByText(/VIP Pass/i);
    await screen.findByText(/€2,380.50/i);
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

export const OpenedWithTimeRemainingDeletion: Story = {
  args: {
    timeRemainingDeletion: true,
  },
  play: async () => {
    const accordionTrigger = await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    accordionTrigger.click();
    await screen.findByText(/6 x/i);
    screen.getByText(/General Admission/i);
    await screen.findByText(/€1,237.86/i);
    // screen.getByText(/expires: in 4 hours/i);
    screen.getByText(/3 x/i);
    screen.getByText(/VIP Pass/i);
    screen.getByText(/€2,380.50/i);
    // screen.getByText(/expires: in 29 minutes/i);
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

export const OpenedWithNoActions: Story = {
  args: {
    noActions: true,
  },
  play: async () => {
    const accordionTrigger = await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    accordionTrigger.click();
    await screen.findByText(/6 x/i);
    screen.getByText(/General Admission/i);
    await screen.findByText(/€1,237.86/i);
    expect(screen.queryByText(/Edit/i)).toBeNull();
    expect(screen.queryByText(/Delete/i)).toBeNull();
  },
};

export const OpenedMobile: Story = {
  parameters: {
    ...mobileMode,
  },
  ...OpenedWithTimeRemainingDeletion,
};

export const Skeleton: Story = {
  render: () => (
    <div className="mx-5">
      <EventPassesSkeleton />
    </div>
  ),
};

export const SkeletonMobile: Story = {
  parameters: {
    ...mobileMode,
  },
  ...Skeleton,
};
