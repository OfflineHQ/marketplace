import * as authProvider from '@next/auth';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { SessionDecorator, ToasterDecorator } from '@test-utils/storybook';
import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';
import { ProfileNavClient } from './ProfileNavClient';
import { ProfileNavClientExample, user } from './examples';

const meta = {
  component: ProfileNavClient,
  render: ProfileNavClientExample,
  decorators: [ToasterDecorator],
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    moduleMock: {
      mock: () => {
        const mockAuth = createMock(authProvider, 'useAuthContext');
        mockAuth.mockReturnValue({
          connecting: false,
          login: () => Promise.resolve(),
          logout: () => Promise.resolve(),
          createAccount: () => Promise.resolve(),
        });
        const mockIntl = createMock(nextIntl, 'useLocale');
        mockIntl.mockReturnValue('en');
        return [mockAuth, mockIntl];
      },
    },
  },
} satisfies Meta<typeof ProfileNavClient>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UserNoEmail: Story = {
  args: {
    isNextAuthConnected: true,
    account: {
      ...user,
      email: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('my account', { exact: false }));
    await screen.findByText(/verify my email/i);
  },
};

export const UserNoEmailClick: Story = {
  ...UserNoEmail,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  decorators: [SessionDecorator],
  play: async (props) => {
    await UserNoEmail.play(props);
    userEvent.click(await screen.findByText(/verify my email/i));
    expect(await screen.findByRole('dialog')).toBeTruthy();
  },
};

export const NotSignedIn: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText('Sign In'));
    await screen.findByText('Settings');
    await screen.findByText('Support');
  },
};

export const SignUp: Story = {
  args: {
    isNextAuthConnected: false,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/Sign In/i));
    userEvent.click(await screen.findByText(/Sign Up/i));
    await screen.findByText(/Account created successfully/i);
  },
};

export const WithUserSignOut: Story = {
  args: {
    isNextAuthConnected: true,
    account: user,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/john/i));
    await screen.findByText('Settings');
    await screen.findByText('Support');
    userEvent.click(await screen.findByText(/Sign Out/i));
    await screen.findByText(/You have been signed out/i);
  },
};
