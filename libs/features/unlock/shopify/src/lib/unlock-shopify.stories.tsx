import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { UnlockShopify } from './unlock-shopify';

const meta = {
  component: UnlockShopify,
} satisfies Meta<typeof UnlockShopify>;

export default meta;

type Story = StoryObj<typeof UnlockShopify>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    expect(canvasElement).toBeTruthy();
  },
};
