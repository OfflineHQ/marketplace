// EventDates.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { EventDates, EventDatesProps } from './EventDates';
import { eventDatesProps } from './examples';

const meta = {
  component: EventDates,
  args: eventDatesProps,
} satisfies Meta<typeof EventDates>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Detailed: Story = {
  args: {
    ...eventDatesProps,
    detailed: true,
  },
};

export const OneDate: Story = {
  args: {
    ...eventDatesProps,
    eventDateLocations: [eventDatesProps.eventDateLocations[0]],
  },
};
