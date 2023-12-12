import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { ProfileNavClient } from './ProfileNavClient';
import { ProfileNavClientExample } from './examples';

const meta = {
  component: ProfileNavClient,
  render: ProfileNavClientExample,
} satisfies Meta<typeof ProfileNavClient>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isNextAuthConnected: false,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('Sign in'));
    await screen.findByText('Settings');
    await screen.findByText('Support');
  },
};
