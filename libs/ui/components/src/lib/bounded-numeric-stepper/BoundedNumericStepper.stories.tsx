// BoundedNumericStepper.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import {
  BoundedNumericStepper,
  BoundedNumericStepperProps,
} from './BoundedNumericStepper';

import { useState } from 'react';

const meta = {
  title: 'Molecules/BoundedNumericStepper',
  component: BoundedNumericStepper,
  args: {
    minVal: 0,
    maxVal: 10,
    value: 5,
    initialValue: 5,
    onChange: (value: number) => {},
  },
} satisfies Meta<typeof BoundedNumericStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {}; // Ensure React is imported to use JSX and hooks

const NumericStepperComponent = ({
  args,
}: {
  args: BoundedNumericStepperProps;
}) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <BoundedNumericStepper {...args} value={value} onChange={handleChange} />
  );
};

export const Increment: Story = {
  render: (args) => <NumericStepperComponent args={args} />,
  play: async () => {
    screen.getByText('5'); // Initial value check
    const incrementButton = screen.getByRole('button', {
      name: /increment value/i,
    });
    await userEvent.click(incrementButton);
    // After the click, the value should now be 6
    await screen.findByText('6'); // Updated value check
  },
};

export const Decrement: Story = {
  render: (args) => <NumericStepperComponent args={args} />,
  args: {
    initialValue: 1,
    value: 1,
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
    value: 10,
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
