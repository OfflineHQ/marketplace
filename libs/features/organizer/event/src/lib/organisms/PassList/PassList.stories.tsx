// PassList.stories.tsx
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { screen } from '@storybook/testing-library';
import { default as passCardMeta } from '../../molecules/PassCard/PassCard.stories';
import { PassList, PassListSkeleton } from './PassList';
import { PassListBoundaryMaxExample, passListProps } from './examples';

const meta = {
  component: PassList,
  args: passListProps,
  parameters: passCardMeta.parameters,
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
