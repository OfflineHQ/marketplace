import type { Meta, StoryObj } from '@storybook/react';

import { AppNavLayout } from './AppNavLayout';
import {
  ProfileNavWithAdminRole,
  ProfileNavWithNoUser,
  ProfileNavWithUser,
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

export const WithUser: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithUser />,
  },
};

export const WithAdminRole: Story = {
  args: {
    children: 'test',
    profileNav: <ProfileNavWithAdminRole />,
  },
};

export const WithNoUserMobile: Story = {
  ...WithNoUser,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserMobile: Story = {
  ...WithUser,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
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
