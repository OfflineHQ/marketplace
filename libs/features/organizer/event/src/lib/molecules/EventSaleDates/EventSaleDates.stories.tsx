import { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';
import { EventSaleDates } from './EventSaleDates';
import {
  eventParametersSaleEnded,
  eventParametersSaleNotStarted,
  eventParametersSaleOngoing,
} from './examples';

const meta: Meta<typeof EventSaleDates> = {
  component: EventSaleDates,
};

export default meta;

type Story = StoryObj<typeof EventSaleDates>;

export const SaleNotStarted: Story = {
  args: {
    eventParameters: eventParametersSaleNotStarted,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/hasn't started/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const SaleOngoing: Story = {
  args: {
    eventParameters: eventParametersSaleOngoing,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/ongoing/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const SaleEnded: Story = {
  args: {
    eventParameters: eventParametersSaleEnded,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/ended/i);
    expect(textElement).toBeInTheDocument();
  },
};
