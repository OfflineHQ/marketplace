import type { Meta, StoryObj } from '@storybook/react';
// import { cryptoUserSession } from '../profile-avatar/examples';
import { organizerRoleAdmin } from '../role-avatar/examples';
import { ProfileNav, ProfileNavSkeleton } from './ProfileNav';
import { ProfileNavExample, user } from './examples';

const meta = {
  component: ProfileNav,
  render: ProfileNavExample,
} satisfies Meta<typeof ProfileNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotConnected: Story = {
  args: {
    isLoading: false,
    signInText: 'Sign in',
    items: [],
  },
};

export const WithAdminRole: Story = {
  args: {
    role: organizerRoleAdmin,
    isLoading: false,
    items: [],
  },
};

export const WithAdminRoleMobile: Story = {
  args: {
    role: organizerRoleAdmin,
    isLoading: false,
    items: [],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithAdminRoleLoading: Story = {
  args: {
    role: organizerRoleAdmin,
    isLoading: true,
    items: [],
  },
};

export const WithUser: Story = {
  args: {
    user,
    isLoading: false,
    items: [],
  },
};

export const Skeleton: Story = {
  render: ProfileNavSkeleton,
};
