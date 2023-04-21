import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { ProfileNav } from './ProfileNav';
import { ProfileNavExample, cryptoUserMenuItems, normalUserMenuItems } from './examples';
import { cryptoUserSession, normalUserSession } from '../profile-avatar/examples';

const meta = {
  component: ProfileNav,
  render: ProfileNavExample,
  args: {
    session: cryptoUserSession,
    items: cryptoUserMenuItems,
  },
} satisfies Meta<typeof ProfileNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CryptoUser: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('0x', { exact: false }));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};

export const NormalUser: Story = {
  args: {
    session: normalUserSession,
    items: normalUserMenuItems,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('@', { exact: false }));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};
