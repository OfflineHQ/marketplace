// PassTotal.stories.tsx
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { screen } from '@storybook/testing-library';
import { PassTotal, PassTotalSkeleton } from './PassTotal';
import {
  passTotalProps,
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
} from './examples';

const meta = {
  component: PassTotal,
  args: passTotalProps,
  render: (props) => <PassTotal {...props} />,
} satisfies Meta<typeof PassTotal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const With1Pass: Story = {
  args: {
    passesCart: [{ ...passWithMaxAmountCart, quantity: 1 }],
  },
  play: async () => {
    const passTotal = await screen.findByText(/1 pass/i);
    expect(passTotal).toBeInTheDocument();
    const totalPrice = screen.getByText(/€1,237.86/i);
    expect(totalPrice).toBeInTheDocument();
  },
};

export const WithSeveralPasses: Story = {
  args: {
    passesCart: [
      { ...passWithMaxAmountCart, quantity: 3 },
      { ...passWithMaxAmountPerUserCart, quantity: 6 },
    ],
  },
  play: async () => {
    const passTotal = await screen.findByText(/9 passes/i);
    expect(passTotal).toBeInTheDocument();
    const totalPrice = screen.getByText(/€17,996.58/i);
    expect(totalPrice).toBeInTheDocument();
  },
};

export const Skeleton: Story = {
  render: () => <PassTotalSkeleton />,
};
