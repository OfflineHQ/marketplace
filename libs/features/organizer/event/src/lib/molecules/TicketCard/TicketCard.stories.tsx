// TicketCard.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { TicketCard, TicketCardProps } from './TicketCard';
import { TicketCardExample, ticketCardProps } from './examples';

const meta = {
  component: TicketCard,
  args: ticketCardProps,
  render: TicketCardExample,
} satisfies Meta<typeof TicketCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  args: {
    ...ticketCardProps,
    numTickets: 3,
    maxVal: 3,
  },
  play: async () => {
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    expect(incrementButton).toBeDisabled();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    expect(decrementButton).not.toBeDisabled();
  },
};
