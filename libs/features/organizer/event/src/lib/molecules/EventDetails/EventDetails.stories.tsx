import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';
import { EventDetails, EventDetailsSkeleton } from './EventDetails';
import { eventDetailsProps, long_description } from './examples';

const meta = {
  component: EventDetails,
  args: eventDetailsProps,
} satisfies Meta<typeof EventDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLongDescription: Story = {
  args: {
    description: long_description,
  },
};

export const Loading: Story = {
  render: () => <EventDetailsSkeleton />,
};
