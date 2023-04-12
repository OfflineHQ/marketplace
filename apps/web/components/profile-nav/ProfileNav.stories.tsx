import type { Meta } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { ProfileNav } from './ProfileNav';
import { ProfileNavExample, menuItems } from './examples';
import { cryptoUserSession, normalUserSession } from '../profile-avatar/examples';

const Story: Meta<typeof ProfileNav> = {
  component: ProfileNav,
  render: ProfileNavExample,
  parameters: {
    screen: {
      mobile: true,
    },
  },
  args: {
    session: cryptoUserSession,
    items: menuItems,
  },
};
export default Story;

export const CryptoUser = {
  args: {},
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('0x', { exact: false }));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};

export const NormalUser = {
  args: {
    session: normalUserSession,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('@', { exact: false }));
    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};
