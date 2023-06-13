// PassPurchase.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassPurchase } from './PassPurchase';
import {
  PassPurchaseExample,
  passPurchaseProps,
  passPurchasePropsWithLotsOfPasses,
  PassPurchaseLoadingExample,
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

export const NoPassSelected: Story = {
  args: {
    ...passPurchaseProps,
    passes: passPurchaseProps.passes.map((pass) => ({
      ...pass,
      numTickets: 0,
    })),
  },
};

export const SelectPasses: Story = {
  ...NoPassSelected,
  play: async () => {
    expect(await screen.findByText(/VIP Pass/i)).toBeInTheDocument();
    const passCards = await screen.findAllByRole('button');
    expect(passCards).toHaveLength(5); // Nav + Two buttons (increment and decrement) for each PassCard
    passCards[1].click(); // Click the first pass increment button
    const cartButton = await screen.findByRole('button', {
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
    expect(await screen.findByText(/Premium pass/i)).toBeInTheDocument();
    const passCards = await screen.findAllByRole('button');
    expect(passCards).toHaveLength(13); // Nav + Two buttons (increment and decrement) for each PassCard
    passCards[9].click(); // Click the 6th pass increment button
    const cartButton = await screen.findByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();
  },
};

export const WithFullSizeAndBackButton: Story = {
  args: {
    ...WithLotsOfPasses.args,
    size: 'full',
  },
  play: async () => {
    const backButton = screen.getByRole('button', {
      name: /Go back to the event/i,
    });
    expect(backButton).toBeVisible();
  },
};

export const Loading: Story = {
  render: PassPurchaseLoadingExample,
};

export const LoadingFullSize: Story = {
  ...Loading,
  args: {
    size: 'full',
  },
};
