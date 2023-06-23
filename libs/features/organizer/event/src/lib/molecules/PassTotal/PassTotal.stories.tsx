// PassTotal.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassTotal } from './PassTotal';
import {
  passTotalProps,
  PassTotalWith1PassExample,
  PassTotalWithSeveralPassesExample,
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
