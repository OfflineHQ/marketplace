import { type Meta, type StoryObj } from '@storybook/react';

import { expect, screen, userEvent } from '@storybook/test';
import { sleep } from '@utils';
import { AppNavLayout } from './AppNavLayout';
import {
  MenuNavWithAdminRole,
  MenuNavWithNoRole,
  MenuNavWithNoUser,
  MenuNavWithSuperAdminRole,
  ProfileNavLoading,
  ProfileNavWithAdminRole,
  ProfileNavWithNoUser,
  ProfileNavWithNoUserLoading,
  ProfileNavWithSuperAdminRole,
  ProfileNavWithUser,
  ProfileNavWithUserLoading,
} from './examples';

import { mobileMode } from '@test-utils/storybook';

const meta = {
  component: AppNavLayout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppNavLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithNoUser: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithNoUser />,
    profileNav: <ProfileNavWithNoUser />,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const signIn = await screen.findAllByText('Sign in');
    userEvent.click(signIn[0]);
    await screen.findByText('Settings');
    await screen.findByText('Support');
  },
};

export const WithUser: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithNoRole />,
    profileNav: <ProfileNavWithUser />,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const myRolesRoute = await screen.findAllByText(/my roles/i);
    userEvent.click(myRolesRoute[0]);
    const profileButton = await screen.findAllByText(/john/i);
    userEvent.click(profileButton[0]);
    await screen.findByText('Settings');
    await screen.findByText('Support');
    await screen.findByText('Sign out');
  },
};

export const WithAdminRole: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithAdminRole />,
    profileNav: <ProfileNavWithAdminRole />,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const eventsRoute = await screen.findAllByText(/events/i);
    userEvent.click(eventsRoute[0]);
    const profileButton = await screen.findAllByText(/organizer admin/i);
    userEvent.click(profileButton[0]);
    await screen.findByText(/super admin/i);
  },
};

export const WithSuperAdminRole: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithSuperAdminRole />,
    profileNav: <ProfileNavWithSuperAdminRole />,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const eventsRoute = await screen.findAllByText(/events/i);
    userEvent.click(eventsRoute[0]);
    const manageRoute = await screen.findAllByText(/manage/i);
    userEvent.click(manageRoute[0]);
    const profileButton = await screen.findAllByText(/organizer super admin/i);
    userEvent.click(profileButton[0]);
    await screen.findByText(/organizer admin/i);
  },
};

export const WithNoUserLoading: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithNoUser />,
    profileNav: <ProfileNavWithNoUserLoading />,
  },
};

export const WithSkeleton: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithAdminRole />,
    profileNav: <ProfileNavLoading />,
  },
};

export const WithUserLoading: Story = {
  args: {
    children: 'test',
    menuNav: <MenuNavWithAdminRole />,
    profileNav: <ProfileNavWithUserLoading />,
  },
};

export const WithNoUserMobile: Story = {
  ...WithNoUser,
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const signIn = await screen.findAllByText('Sign in');
    userEvent.click(signIn[1]);
    await screen.findByText('Settings');
    await screen.findByText('Support');
  },
};

export const WithUserMobile: Story = {
  ...WithUser,
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/my-roles',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const myRolesRoute = await screen.findAllByText(/my roles/i);
    expect(myRolesRoute[1]).toBeInTheDocument();
    const profileButton = await screen.findAllByText(/john/i);
    userEvent.click(profileButton[1]);
    await screen.findByText('Settings');
    await screen.findByText('Support');
    await screen.findByText('Sign out');
  },
};

export const WithSuperAdminRoleMobile: Story = {
  ...WithSuperAdminRole,
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/events',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await sleep(100);
    const eventsRoute = await screen.findAllByText(/Events/i);
    expect(eventsRoute[1]).toBeInTheDocument();
    const profileButton = await screen.findAllByText(/organizer super admin/i);
    userEvent.click(profileButton[1]);
    await screen.findByText(/organizer admin/i);
  },
};

export const WithNoUserLoadingMobile: Story = {
  ...WithNoUserLoading,
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
  },
};

export const WithSkeletonMobile: Story = {
  ...WithSkeleton,
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
  },
};

export const WithUserLoadingMobile: Story = {
  ...WithUserLoading,
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
  },
};
