// PassTotal.stories.tsx
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { screen } from '@storybook/testing-library';
import { PassTotal } from './PassTotal';
import {
  PassTotalWith1PassExample,
  PassTotalWithSeveralPassesExample,
  passTotalProps,
} from './examples';

const meta = {
  component: PassTotal,
  args: passTotalProps,
} satisfies Meta<typeof PassTotal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const With1Pass: Story = {
  render: PassTotalWith1PassExample,
  play: async () => {
    const passTotal = await screen.findByText(/1 pass/i);
    expect(passTotal).toBeInTheDocument();
    const totalPrice = screen.getByText(/€1,300.00/i);
    expect(totalPrice).toBeInTheDocument();
  },
};

export const WithSeveralPasses: Story = {
  render: PassTotalWithSeveralPassesExample,
  play: async () => {
    const passTotal = await screen.findByText(/9 passes/i);
    expect(passTotal).toBeInTheDocument();
    const totalPrice = screen.getByText(/€15,300.00/i);
    expect(totalPrice).toBeInTheDocument();
  },
};
