import * as authProvider from '@next/auth';
import { StoryObj, type Meta } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { createMock } from 'storybook-addon-module-mock';
import { ProfileNavClient } from './ProfileNavClient';
import { ProfileNavClientExample, user } from './examples';
import { ToasterDecorator } from '@test-utils/storybook';
import {
  organizerRoleAdmin,
  organizerRoleSuperAdmin,
} from '../role-avatar/examples';

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
        return [mockAuth];
      },
    },
  },
} satisfies Meta<typeof ProfileNavClient>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isNextAuthConnected: false,
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/Sign In/i));
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

export const WithUserNoEmail: Story = {
  parameters: {
    chromatic: { disable: false },
  },
  args: {
    isNextAuthConnected: true,
    account: {
      ...user,
      email: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/0x/i));
    await screen.findByText(/verify my email/i);
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

export const WithUserChangingRole: Story = {
  args: {
    ...WithUserSignOut.args,
    roles: [organizerRoleAdmin, organizerRoleSuperAdmin],
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/john/i));
    await screen.findByText('Settings');
    await screen.findByText('Support');
    await screen.findByText(/Switch to role/i);
    userEvent.click(await screen.findByText(/Super Admin/i));
    await screen.findByText(/Switched to role/i);
    await screen.findByText(/Super Admin/i);
  },
};

export const WithUserCurrentRole: Story = {
  args: {
    ...WithUserChangingRole.args,
    account: {
      ...user,
      role: organizerRoleAdmin,
    },
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/organizer name/i));
    screen.getByText(/@/i);
    screen.findByText('Settings');
    screen.findByText('Support');
    await screen.findByText(/Switch to role/i);
    screen.findByText(/Super Admin/i);
    userEvent.click(await screen.findByText(/Switch to my account/i));
    await screen.findByText(/You are now connected with your own account/i);
  },
};
