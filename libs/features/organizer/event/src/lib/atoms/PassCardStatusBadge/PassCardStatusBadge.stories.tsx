import { SaleStatus } from '@features/organizer/event-types';
import { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';
import { PassCardStatusBadge } from './PassCardStatusBadge';

const meta = {
  component: PassCardStatusBadge,
} as Meta<typeof PassCardStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SoldOut: Story = {
  args: {
    isSoldOut: true,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/sold out/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const SaleNotStarted: Story = {
  args: {
    saleStatus: SaleStatus.NotStarted,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/not started/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const SaleEnded: Story = {
  args: {
    saleStatus: SaleStatus.Ended,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/sale ended/i);
    expect(textElement).toBeInTheDocument();
  },
};

export const AlreadyHavePurchase: Story = {
  args: {
    hasConfirmedPasses: true,
  },
  play: async ({ container }) => {
    const textElement = await screen.findByText(/purchase/i);
    expect(textElement).toBeInTheDocument();
  },
};
