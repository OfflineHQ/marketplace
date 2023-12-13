// BoundedNumericStepper.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { BoundedNumericStepper } from './BoundedNumericStepper';

const meta = {
  title: 'Molecules/BoundedNumericStepper',
  component: BoundedNumericStepper,
  args: {
    minVal: 0,
    maxVal: 10,
    initialValue: 5,
    onChange: () => null,
  },
} satisfies Meta<typeof BoundedNumericStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Increment: Story = {
  play: async () => {
    screen.getByText('5');
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    await userEvent.click(incrementButton);
    const newValue = screen.getByText('6');
    expect(newValue).not.toBe('5');
  },
};

export const Decrement: Story = {
  args: {
    initialValue: 1,
    maxVal: 1,
    onChange: () => null,
  },
  play: async () => {
    screen.getByText('1');
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    await userEvent.click(decrementButton);
    const newValue = screen.getByText('0');
    expect(newValue).not.toBe('1');
  },
};

export const BoundaryConditions: Story = {
  args: {
    minVal: 0,
    maxVal: 10,
    initialValue: 10,
    onChange: () => null,
  },
  play: async () => {
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    await expect(incrementButton).toBeDisabled();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    await expect(decrementButton).toBeEnabled();
  },
};
