import type { Meta, StoryObj } from '@storybook/react';
// import { cryptoUserSession } from '../profile-avatar/examples';
import { screen, userEvent } from '@storybook/testing-library';
import { organizerRoleAdmin } from '../role-avatar/examples';
import { ProfileNav, ProfileNavSkeleton } from './ProfileNav';
import {
  ProfileNavExample,
  itemsAdmin,
  itemsNotConnected,
  itemsUserNoRoles,
  itemsUserWithRoles,
  user,
} from './examples';

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
    items: itemsNotConnected,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(await screen.findByText('Sign in'));
    await screen.findByText('Settings');
    await screen.findByText('Support');
  },
};

export const WithUserNoRoles: Story = {
  args: {
    user,
    isLoading: false,
    items: itemsUserNoRoles,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(await screen.findByText(/john/i));
    await screen.findByText('Settings');
    screen.getByText('Support');
    screen.getByText(/0x/i);
    screen.getByText(/sign out/i);
  },
};

export const WithUserRoles: Story = {
  args: {
    user,
    isLoading: false,
    items: itemsUserWithRoles,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(await screen.findByText(/john/i));
    await screen.findByText('Settings');
    screen.getByText('Support');
    screen.getByText(/0x/i);
    screen.getByText(/sign out/i);
    await userEvent.click(await screen.findByText(/switch to role/i));
    await screen.findByText(/super admin/i);
  },
};

export const WithAdminRole: Story = {
  args: {
    role: organizerRoleAdmin,
    isLoading: false,
    items: itemsAdmin,
  },
};

export const WithAdminRoleMobile: Story = {
  ...WithAdminRole,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithAdminRoleLoading: Story = {
  args: {
    ...WithAdminRole,
    isLoading: true,
  },
};

export const WithUserMobile: Story = {
  ...WithUserNoRoles,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Skeleton: Story = {
  render: ProfileNavSkeleton,
  ...WithUserNoRoles,
};
