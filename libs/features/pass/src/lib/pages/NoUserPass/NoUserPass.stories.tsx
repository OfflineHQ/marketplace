import * as authProvider from '@next/auth';
import type { Meta, StoryObj } from '@storybook/react';

import { createMock } from 'storybook-addon-module-mock';
import { NoUserPass } from './NoUserPass';
import { NoUserPassExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof NoUserPass> = {
  component: NoUserPass,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mockAuth = createMock(authProvider, 'useAuthContext');
        mockAuth.mockImplementation(() => ({
          login: () => Promise.resolve(),
          logout: () => Promise.resolve(),
          createAccount: () => Promise.resolve(),
          isReady: true,
          connecting: false,
        }));
        return [mockAuth];
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NoUserPass>;

export const SectionWithNoUser: Story = {
  render: NoUserPassExample,
};

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithUserEmail.args} />,
//   },
// };
