// PassCard.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassCard, PassCardProps, PassCardSkeleton } from './PassCard';
import {
  PassCardExample,
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
} from './examples';

const meta = {
  component: PassCard,
  args: passWithMaxAmount,
  render: PassCardExample,
} satisfies Meta<typeof PassCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  args: {
    ...passWithMaxAmountPerUser,
    numTickets: 3,
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

export const SoldOut: Story = {
  args: passWithSoldOut,
  play: async () => {
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    expect(incrementButton).toBeDisabled();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    expect(decrementButton).toBeDisabled();
  },
};

export const Loading: Story = {
  render: () => <PassCardSkeleton />,
};
