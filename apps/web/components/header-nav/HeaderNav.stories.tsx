import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
  waitFor,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { menuSections } from '../nav-desktop/examples';
import {
  cryptoUserSession,
  normalUserSessionWithImage,
} from '../profile-avatar/examples';
import { cryptoUserMenuItems, normalUserMenuItems } from '../profile-nav/examples';
import { HeaderNav } from './HeaderNav';
import { HeaderNavExample, displayItems, displayItemsDark, languages } from './examples';
import { sleep } from '@utils';

const meta = {
  component: HeaderNav,
  render: HeaderNavExample,
  args: {
    profileSections: [],
    menuSections,
    session: null,
    signIn: () => sleep(1000),
    sessionLoading: false,
    settings: {
      languages,
      languageHelperText: 'Select your language',
      displays: displayItems,
      displayHelperText: 'Select a display mode',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeaderNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('Sign in'));
  },
};

export const CryptoUser: Story = {
  args: {
    session: cryptoUserSession,
    profileSections: cryptoUserMenuItems,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('0x', { exact: false }));
    await screen.findByText('Log out');
  },
};

export const NormalUser: Story = {
  args: {
    session: normalUserSessionWithImage,
    profileSections: normalUserMenuItems,
  },
};

export const SessionLoading: Story = {
  ...NormalUser,
  args: {
    sessionLoading: true,
  },
  play: undefined,
};

export const MobileNoSession: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileSessionLoading: Story = {
  ...SessionLoading,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileOpenedMenu: Story = {
  ...NormalUser,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByTestId('hamburger-menu'));
    userEvent.click(screen.getByText('Explore'));
  },
};

export const MobileOpenedProfile: Story = {
  ...MobileOpenedMenu,
  play: async (context) => {
    if (MobileOpenedMenu.play) await MobileOpenedMenu.play(context);
    await sleep(50);
    userEvent.click(screen.getByTestId('hamburger-menu'));
    userEvent.click(screen.getByTestId('profile-menu'));
    const Profile = await screen.findByRole('menuitem', {
      name: /Profile/i,
    });
    fireEvent.click(Profile);
    userEvent.click(await screen.findByTestId('profile-menu'));
  },
};
