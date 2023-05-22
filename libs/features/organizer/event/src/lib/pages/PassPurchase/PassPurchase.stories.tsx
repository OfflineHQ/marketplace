// PassPurchase.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import {
  PassPurchase,
  PassPurchaseProps,
  PassPurchaseSkeleton,
} from './PassPurchase';
import {
  PassPurchaseExample,
  passPurchaseProps,
  passPurchasePropsWithLotsOfPasses,
} from './examples';

const meta = {
  component: PassPurchase,
  args: passPurchaseProps,
  render: PassPurchaseExample,
  parameters: {
    layout: 'fullscreen',
  },
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
    expect(passCards).toHaveLength(5); // Two buttons (increment and decrement) for each PassCard
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

export const WithLotsOfPasses: Story = {
  args: {
    ...passPurchasePropsWithLotsOfPasses,
    passes: passPurchasePropsWithLotsOfPasses.passes.map((pass) => ({
      ...pass,
      numTickets: 0,
    })),
  },
};

export const WithLotsOfPassesSelected: Story = {
  ...WithLotsOfPasses,
  play: async () => {
    const passCards = screen.getAllByRole('button');
    expect(passCards).toHaveLength(15); // Two buttons (increment and decrement) for each PassCard + close btn
    passCards[11].click(); // Click the 7th pass increment button
    const cartButton = await screen.findByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();
  },
};

export const Loading: Story = {
  render: () => <PassPurchaseSkeleton />,
};
