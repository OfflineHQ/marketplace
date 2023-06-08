// EventLocations.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { EventLocations, EventLocationsProps } from './EventLocations';
import { eventLocationsProps, event2LocationsProps } from './examples';

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

export const Venue: Story = {
  args: {
    ...event2LocationsProps,
  },
};

export const VenueDetailed: Story = {
  args: {
    ...event2LocationsProps,
    detailed: true,
  },
};
