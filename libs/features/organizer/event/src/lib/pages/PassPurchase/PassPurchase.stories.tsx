// PassPurchaseSheet.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { PassPurchaseSheet } from './PassPurchaseSheet';
import {
  PassPurchaseSheetExample,
  passPurchaseProps,
  passPurchasePropsWithLotsOfPasses,
  PassPurchaseSheetLoadingExample,
  PassPurchaseCardExample,
} from './examples';

const meta = {
  component: PassPurchaseSheet,
  args: passPurchaseProps,
  render: PassPurchaseSheetExample,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PassPurchaseSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoPassSelected: Story = {
  args: {
    ...passPurchaseProps,
    passes: passPurchaseProps.passes.map((pass) => ({
      ...pass,
      amount: 0,
    })),
  },
};

export const SelectPasses: Story = {
  ...NoPassSelected,
  play: async () => {
    expect(await screen.findByText(/VIP Pass/i)).toBeInTheDocument();
    const passCards = await screen.findAllByRole('button', {
      name: /increment value/i,
    });
    expect(passCards).toHaveLength(2);
    passCards[0].click(); // Click the first pass increment button
    const cartButton = await screen.findByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();
  },
};

export const WithLotsOfPasses: Story = {
  args: {
    ...passPurchasePropsWithLotsOfPasses,
    passes: passPurchasePropsWithLotsOfPasses.passes.map((pass) => ({
      ...pass,
      amount: 0,
    })),
  },
};

export const WithLotsOfPassesSelected: Story = {
  ...WithLotsOfPasses,
  play: async () => {
    expect(await screen.findByText(/Premium pass/i)).toBeInTheDocument();
    const passCards = await screen.findAllByRole('button', {
      name: /increment value/i,
    });
    expect(passCards).toHaveLength(6);
    passCards[5].click(); // Click the 6th pass increment button
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
  render: PassPurchaseSheetLoadingExample,
};

export const LoadingFullSize: Story = {
  ...Loading,
  args: {
    size: 'full',
  },
};

export const Card: Story = {
  args: {
    backButtonLink: { href: '/dummy' },
  },
  render: PassPurchaseCardExample,
};

export const CardWithLotsOfPassesSelected: Story = {
  ...WithLotsOfPassesSelected,
  args: {
    backButtonLink: { href: '/dummy' },
    ...WithLotsOfPassesSelected.args,
  },
  render: PassPurchaseCardExample,
};
