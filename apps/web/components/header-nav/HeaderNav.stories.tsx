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
import {
  HeaderNavExample,
  displayItems,
  displayItemsDark,
  languages,
  languageText,
  languageHelperText,
  displayText,
  displayHelperText,
} from './examples';
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
      languageText,
      languageHelperText,
      displays: displayItems,
      displayText,
      displayHelperText,
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

export const OpenedDisplay: Story = {
  play: async ({ canvasElement }) => {
    const displayButton = screen.getByRole('button', { name: displayHelperText });
    userEvent.click(displayButton);
    await screen.findByText('Dark');
  },
};

export const OpenedLanguage: Story = {
  play: async ({ canvasElement }) => {
    const LanguageButton = screen.getByRole('button', { name: languageHelperText });
    userEvent.click(LanguageButton);
    await screen.findByText('Français');
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

export const MobileOpenedMenuOpenedDisplay: Story = {
  ...MobileOpenedMenu,
  play: async (context) => {
    await MobileOpenedMenu?.play(context);
    await sleep(500);
    userEvent.click(await screen.findByText(displayText));
    await screen.findByText('Dark');
  },
};

export const MobileOpenedMenuOpenedLanguage: Story = {
  ...MobileOpenedMenu,
  play: async (context) => {
    await MobileOpenedMenu?.play(context);
    await sleep(500);
    userEvent.click(await screen.findByText(languageText));
    await screen.findByText('Français');
  },
};

export const MobileOpenedMenuDark: Story = {
  ...MobileOpenedMenu,
  args: {
    settings: {
      languages,
      languageText,
      languageHelperText,
      displayText,
      displayHelperText,
      displays: displayItemsDark,
    },
  },
  parameters: {
    darkMode: {
      isDark: true,
    },
    ...MobileOpenedMenu.parameters,
  },
  play: async (context) => {
    await sleep(200);
    await MobileOpenedMenu?.play(context);
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
