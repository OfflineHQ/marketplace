import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

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
  ProfileNavWithFallbackUser,
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

export const WithNormalUser: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithNormalUser />,
    cartNav: <CartNavEmpty />,
    passNav: <PassNavEmpty />,
  },
};
export const WithFallbackUser: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithFallbackUser />,
    cartNav: <CartNavEmpty />,
    passNav: <PassNavEmpty />,
  },
};

export const WithCryptoUser: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithCryptoUser />,
    cartNav: <CartNavEmpty />,
    passNav: <PassNavEmpty />,
  },
};

export const WithDarkMode: Story = {
  ...WithNormalUser,
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
};

export const WithCartItems: Story = {
  args: {
    ...WithNormalUser.args,
    cartNav: <CartNavWithItems />,
  },
};

export const WithPassPing: Story = {
  args: {
    ...WithNormalUser.args,
    passNav: <PassNavWithPing />,
  },
};

export const WithPassLoading: Story = {
  args: {
    ...WithNormalUser.args,
    passNav: <PassNavLoading />,
  },
};

export const WithPassActive: Story = {
  args: {
    ...WithNormalUser.args,
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
    ...WithNormalUser.args,
    cartNav: <NavSectionLoading />,
  },
};

export const WithProfileNavSkeleton: Story = {
  args: {
    ...WithNormalUser.args,
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
  ...WithFallbackUser,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
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
    const profileButton = await screen.findAllByText('JD');
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
