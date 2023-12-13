import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import {
  cryptoUserSession,
  normalUserSession,
  normalUserSessionWithImage,
} from '../profile-avatar/examples';
import { ProfileNav, ProfileNavSkeleton } from './ProfileNav';
import {
  ProfileNavExample,
  cryptoUserMenuItems,
  normalUserMenuItems,
  notConnectedMenuItems,
} from './examples';

const meta = {
  component: ProfileNav,
  render: ProfileNavExample,
  args: {
    user: cryptoUserSession,
    items: cryptoUserMenuItems,
  },
} satisfies Meta<typeof ProfileNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CryptoUser: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('0x', { exact: false }));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};

export const NormalUser: Story = {
  args: {
    user: normalUserSession,
    items: normalUserMenuItems,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('@', { exact: false }));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};

export const NormalUserWithAvatar: Story = {
  args: {
    user: normalUserSessionWithImage,
    items: normalUserMenuItems,
  },
};

export const NoUser: Story = {
  args: {
    user: undefined,
    items: notConnectedMenuItems,
    signInText: 'Sign in',
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('Sign in'));
    await screen.findByText('Settings');
  },
};

export const Loading = {
  args: {
    isLoading: true,
    ...NoUser.args,
  },
};

export const Skeleton: Story = {
  render: ProfileNavSkeleton,
};
