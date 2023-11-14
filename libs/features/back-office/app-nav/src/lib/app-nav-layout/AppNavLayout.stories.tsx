import { expect } from '@storybook/jest';
import { type Meta, type StoryObj } from '@storybook/react';

import { screen, userEvent } from '@storybook/testing-library';
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
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const signIn = await screen.findAllByText('Sign in');
    userEvent.click(signIn[1]);
    await screen.findByText('Settings');
    await screen.findByText('Support');
  },
};

export const WithUserMobile: Story = {
  ...WithUser,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/my-roles',
      },
    },
  },
  play: async ({ canvasElement }) => {
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
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/events',
      },
    },
  },
  play: async ({ canvasElement }) => {
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
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithSkeletonMobile: Story = {
  ...WithSkeleton,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserLoadingMobile: Story = {
  ...WithUserLoading,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
