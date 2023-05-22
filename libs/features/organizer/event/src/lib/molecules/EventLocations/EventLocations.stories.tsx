// EventLocations.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { EventLocations, EventLocationsProps } from './EventLocations';
import { eventLocationsProps } from './examples';

const meta = {
  component: EventLocations,
  args: eventLocationsProps,
} satisfies Meta<typeof EventLocations>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Detailed: Story = {
  args: {
    ...eventLocationsProps,
    detailed: true,
  },
};

export const OneLocation: Story = {
  args: {
    ...eventLocationsProps,
    eventDateLocations: [eventLocationsProps.eventDateLocations[0]],
  },
};
