import { expect, screen, userEvent, within } from '@storybook/test';
import { BlockchainAddress } from './BlockchainAddress';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Molecules/BlockchainAddress',
  component: BlockchainAddress,
} satisfies Meta<typeof BlockchainAddress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    copiedText: 'Address copied!',
    address: '0x1234567890123456789012345678901234567890',
  },
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText(/0x/i));
    const tooltip = await within(document.body).findByRole('tooltip', {
      name: /copied/i,
    });
    await expect(tooltip).toBeVisible();
  },
};
