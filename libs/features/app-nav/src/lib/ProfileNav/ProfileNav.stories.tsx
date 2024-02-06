import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import {
  cryptoUserSession,
  normalUserSession,
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
    signInText: 'Sign In',
    accountPlaceholder: 'My Account',
  },
} satisfies Meta<typeof ProfileNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UserMail: Story = {
  args: {
    user: normalUserSession,
    items: normalUserMenuItems,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/johndoe@/i));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};

// export const UserMailWithAvatar: Story = {
//   args: {
//     user: normalUserSessionWithImage,
//     items: normalUserMenuItems,
//   },
// };

export const NoUser: Story = {
  args: {
    user: undefined,
    items: notConnectedMenuItems,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('Sign In'));
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
