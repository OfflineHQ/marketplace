import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';

import { darkMode, mobileMode } from '@test-utils/storybook';
import { AppNavLayout } from './AppNavLayout';
import {
  CartNavEmpty,
  CartNavWithItems,
  NavSectionLoading,
  PassNavEmpty,
  PassNavLoading,
  PassNavWithPing,
  ProfileNavLoading,
  ProfileNavWithCryptoUser,
  ProfileNavWithNoUser,
  ProfileNavWithNoUserLoading,
  ProfileNavWithNormalUser,
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
    profileNav: <ProfileNavWithNoUser />,
    cartNav: <CartNavEmpty />,
    passNav: <PassNavEmpty />,
  },
};

export const WithUserNoEmail: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithCryptoUser />,
    cartNav: <CartNavEmpty />,
    passNav: <PassNavEmpty />,
  },
};
export const WithUserEmail: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithNormalUser />,
    cartNav: <CartNavEmpty />,
    passNav: <PassNavEmpty />,
  },
};

export const WithDarkMode: Story = {
  ...WithUserEmail,
  parameters: {
    ...darkMode,
  },
};

export const WithCartItems: Story = {
  args: {
    ...WithUserEmail.args,
    cartNav: <CartNavWithItems />,
  },
};

export const WithPassPing: Story = {
  args: {
    ...WithUserEmail.args,
    passNav: <PassNavWithPing />,
  },
};

export const WithPassLoading: Story = {
  args: {
    ...WithUserEmail.args,
    passNav: <PassNavLoading />,
  },
};

export const WithPassActive: Story = {
  args: {
    ...WithUserEmail.args,
    passNav: <PassNavWithPing />,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/pass',
      },
    },
  },
};

export const WithNavSectionSkeleton: Story = {
  args: {
    ...WithUserEmail.args,
    cartNav: <NavSectionLoading />,
  },
};

export const WithProfileNavSkeleton: Story = {
  args: {
    ...WithUserEmail.args,
    profileNav: <ProfileNavLoading />,
  },
};

export const WithAllSkeleton: Story = {
  args: {
    ...WithProfileNavSkeleton.args,
    cartNav: <NavSectionLoading />,
    passNav: <NavSectionLoading />,
  },
};

export const WithMobile: Story = {
  ...WithUserEmail,
  parameters: {
    ...mobileMode,
  },
};

export const WithMobileLoadingProfile: Story = {
  ...WithMobile,
  args: {
    ...WithMobile.args,
    profileNav: <ProfileNavWithNoUserLoading />,
  },
};

export const WithMobileOpenedProfileMenu: Story = {
  ...WithMobile,
  play: async ({ container }) => {
    const profileButton = await screen.findAllByText('🌶');
    // target the second profile button that is on mobile menu
    userEvent.click(profileButton[1]);
    await screen.findByText('Log out');
  },
};

export const WithMobileAllSkeleton: Story = {
  ...WithMobile,
  args: {
    ...WithAllSkeleton.args,
  },
};
