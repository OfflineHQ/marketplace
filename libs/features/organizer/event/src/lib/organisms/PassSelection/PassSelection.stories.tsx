// PassSelection.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import {
  PassSelection,
  PassSelectionProps,
  PassSelectionSkeleton,
} from './PassSelection';
import { PassSelectionExample, passSelectionProps } from './examples';

const meta = {
  component: PassSelection,
  args: passSelectionProps,
  render: PassSelectionExample,
} satisfies Meta<typeof PassSelection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  args: {
    ...passSelectionProps,
    passes: passSelectionProps.passes.map((pass) => ({
      ...pass,
      numTickets: pass.maxVal,
    })),
  },
  play: async () => {
    const incrementButtons = screen.getAllByRole('button', {
      name: /increment value/i,
    });
    incrementButtons.forEach((incrementButton) => {
      expect(incrementButton).toBeDisabled();
    });

    const decrementButtons = screen.getAllByRole('button', {
      name: /decrement value/i,
    });
    decrementButtons.forEach((decrementButton) => {
      expect(decrementButton).not.toBeDisabled();
    });
  },
};

export const Loading: Story = {
  render: () => <PassSelectionSkeleton />,
};
