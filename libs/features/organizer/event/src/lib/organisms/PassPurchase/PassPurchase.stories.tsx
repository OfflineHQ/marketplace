// PassPurchase.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassPurchase, PassPurchaseProps } from './PassPurchase';
import { PassPurchaseExample, passPurchaseProps } from './examples';

const meta = {
  component: PassPurchase,
  args: passPurchaseProps,
  render: PassPurchaseExample,
} satisfies Meta<typeof PassPurchase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...passPurchaseProps,
    passes: passPurchaseProps.passes.map((pass) => ({
      ...pass,
      numTickets: 0,
    })),
  },
};

export const SelectPasses: Story = {
  ...Default,
  play: async () => {
    const passCards = screen.getAllByRole('button');
    expect(passCards).toHaveLength(4); // Two buttons (increment and decrement) for each PassCard
    passCards[1].click(); // Click the first pass increment button
    const cartButton = await screen.findByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();
  },
};

export const WithPassesSelected: Story = {
  play: async () => {
    const cartButton = screen.getByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();

    const passTotal = screen.getByText(/Total/i);
    expect(passTotal).toBeInTheDocument();
  },
};
