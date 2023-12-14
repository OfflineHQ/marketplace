import type { Meta, StoryObj } from '@storybook/react';
// import { cryptoUserSession } from '../profile-avatar/examples';
import { screen, userEvent } from '@storybook/test';
import { sleep } from '@utils';
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
    await sleep(100);
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
    await sleep(100);
    await userEvent.click(await screen.findByText(/john/i));
    await screen.findByText('Settings');
    screen.getByText('Support');
    screen.getByText(/0x/i);
    screen.getByText(/sign out/i);
  },
};

export const WithUserNoRolesMobile: Story = {
  ...WithUserNoRoles,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserRoles: Story = {
  args: {
    user,
    isLoading: false,
    items: itemsUserWithRoles,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    await userEvent.click(await screen.findByText(/john/i));
    await screen.findByText('Settings');
    screen.getByText('Support');
    screen.getByText(/0x/i);
    screen.getByText(/sign out/i);
    screen.getByText(/switch to role/i);
    screen.getByText(/super admin/i);
    screen.getByText(/organizer admin/i);
  },
};

export const WithAdminRole: Story = {
  args: {
    role: organizerRoleAdmin,
    isLoading: false,
    items: itemsAdmin,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    await userEvent.click(await screen.findByText(/Organizer admin/i));
    await screen.findByText('Settings');
    screen.getByText(/current role/i);
    screen.getByText('Support');
    screen.getByText(/0x/i);
    screen.getByText(/sign out/i);
    screen.getByText(/switch to my account/i);
    screen.getByText(/switch to role/i);
    screen.getByText(/super admin/i);
  },
};

export const WithAdminRoleMobile: Story = {
  ...WithAdminRole,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    await userEvent.click(await screen.findByText(/Organizer admin/i));
    await screen.findByText('Settings');
    screen.getByText(/current role/i);
    screen.getByText('Support');
    screen.getByText(/0x/i);
    screen.getByText(/sign out/i);
    screen.getByText(/switch to my account/i);
    screen.getByText(/switch to role/i);
    screen.getByText(/super admin/i);
  },
};

export const WithAdminRoleLoading: Story = {
  args: {
    ...WithAdminRole.args,
    isLoading: true,
  },
};

export const WithAdminRoleLoadingMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...WithAdminRole.args,
    isLoading: true,
  },
};

export const Skeleton: Story = {
  render: ProfileNavSkeleton,
  args: NotConnected.args,
};
