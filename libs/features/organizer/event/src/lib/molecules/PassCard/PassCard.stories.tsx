// PassCard.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassCard, PassCardProps } from './PassCard';
import { PassCardExample, passCardProps } from './examples';

const meta = {
  component: PassCard,
  args: passCardProps,
  render: PassCardExample,
} satisfies Meta<typeof PassCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  args: {
    ...passCardProps,
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
