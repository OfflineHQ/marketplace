import type { Meta, StoryObj } from '@storybook/react';
import { EventHero, EventHeroSkeleton } from './EventHero';
import { eventHeroProps } from './examples';

const meta = {
  component: EventHero,
  args: eventHeroProps,
} satisfies Meta<typeof EventHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <EventHeroSkeleton />,
};
