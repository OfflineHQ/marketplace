// PassList.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassList, PassListSkeleton } from './PassList';
import { PassListBoundaryMaxExample, passListProps } from './examples';

const meta = {
  component: PassList,
  args: passListProps,
} satisfies Meta<typeof PassList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  render: PassListBoundaryMaxExample,
  play: async () => {
    const incrementButtons = await screen.findAllByRole('button', {
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
  render: () => <PassListSkeleton />,
};
