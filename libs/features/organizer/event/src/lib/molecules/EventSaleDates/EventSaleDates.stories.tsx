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
    const textElement = await screen.findByText(/Sale not started/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const SaleOngoing: Story = {
  args: {
    eventParameters: eventParametersSaleOngoing,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/Sale ongoing/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const SaleEnded: Story = {
  args: {
    eventParameters: eventParametersSaleEnded,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/Sale ended/i);
    expect(textElement).toBeInTheDocument();
  },
};
