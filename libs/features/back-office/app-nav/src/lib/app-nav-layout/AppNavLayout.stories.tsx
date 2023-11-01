import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

import { AppNavLayout } from './AppNavLayout';
import {
  // ProfileNavWithCryptoUser,
  // ProfileNavWithFallbackUser,
  ProfileNavWithNoUser,
  ProfileNavWithNoUserLoading,
  // ProfileNavWithNormalUser,
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
  },
};

// export const WithNormalUser: Story = {
//   args: {
//     children: 'test',
//     profileNav: <ProfileNavWithNormalUser />,
//   },
// };
// export const WithFallbackUser: Story = {
//   args: {
//     children: 'test',
//     profileNav: <ProfileNavWithFallbackUser />,
//   },
// };

// export const WithCryptoUser: Story = {
//   args: {
//     children: 'test',
//     profileNav: <ProfileNavWithCryptoUser />,
//   },
// };

// export const WithDarkMode: Story = {
//   ...WithNormalUser,
//   parameters: {
//     darkMode: {
//       isDark: true,
//     },
//   },
// };

// export const WithMobile: Story = {
//   ...WithFallbackUser,
//   parameters: {
//     viewport: {
//       defaultViewport: 'mobile1',
//     },
//   },
// };

// export const WithMobileLoadingProfile: Story = {
//   ...WithMobile,
//   args: {
//     ...WithMobile.args,
//     profileNav: <ProfileNavWithNoUserLoading />,
//   },
// };

// export const WithMobileOpenedProfileMenu: Story = {
//   ...WithMobile,
//   play: async ({ container }) => {
//     const profileButton = await screen.findAllByText('JD');
//     // target the second profile button that is on mobile menu
//     userEvent.click(profileButton[1]);
//     await screen.findByText('Log out');
//   },
// };
