// PassCard.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassCard, PassCardProps, PassCardSkeleton } from './PassCard';
import {
  PassCardBoundaryMaxExample,
  PassCardBoundaryMaxPerUserExample,
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
} from './examples';

const meta = {
  component: PassCard,
  args: {
    organizerSlug: 'organizer-slug',
    eventSlug: 'event-slug',
    ...passWithMaxAmount,
  },
} satisfies Meta<PassCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  ...Default,
  render: PassCardBoundaryMaxExample,
  play: async () => {
    const incrementButton = await screen.findByRole('button', {
      name: /increment value/i,
    });
    expect(incrementButton).toBeDisabled();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    expect(decrementButton).not.toBeDisabled();
  },
};

export const BoundaryConditionsPerUser: Story = {
  args: passWithMaxAmountPerUser,
  render: PassCardBoundaryMaxPerUserExample,
  play: async (context) => {
    if (BoundaryConditions.play) await BoundaryConditions.play(context);
  },
};

export const SoldOut: Story = {
  args: passWithSoldOut,
  play: async () => {
    const soldOut = await screen.findByText(/sold-out/i);
    expect(soldOut).toBeInTheDocument();
  },
};

export const Loading: Story = {
  render: () => <PassCardSkeleton />,
};

//TODO add story and handle the case when local cart pass is more than what's available !
