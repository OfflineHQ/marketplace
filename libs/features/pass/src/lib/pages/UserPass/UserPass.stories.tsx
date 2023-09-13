import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
  waitFor,
} from '@storybook/testing-library';
import { sleep } from '@utils';

import { UserPass } from './UserPass';
import { UserPassExample } from './examples';
import {
  UserPassListExample,
  UserPassListSkeletonExample,
  actionsFunctions,
  eventParameters,
  eventParameters2,
} from '../../organisms/UserPassList/examples';
// @ts-ignore
import EmptyPassImage from './empty-pass.svg';

const meta: Meta<typeof UserPass> = {
  component: UserPass,
  parameters: {
    layout: 'fullscreen',
  },
  render: UserPassExample,
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={actionsFunctions}
        eventsParameters={[eventParameters, eventParameters2]}
      />
    ),
  },
};

export default meta;

type Story = StoryObj<typeof UserPass>;

export const WithUser: Story = {};

export const WithUserMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserDarkMode: Story = {
  ...WithUser,
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
};

export const WithUserDarkModeMobileWithTimezoneDialog: Story = {
  ...WithUser,
  parameters: {
    darkMode: {
      isDark: true,
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={actionsFunctions}
        eventsParameters={[eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const button = screen.getByLabelText('Fill Info');
    userEvent.click(screen.getByText(/World cup/i));
    userEvent.click(button);
  },
};

export const WithUserNoData: Story = {
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={actionsFunctions}
        eventsParameters={[]}
      />
    ),
  },
};

export const WithUserNoDataMobile: Story = {
  ...WithUserNoData,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserLoading: Story = {
  args: {
    children: <UserPassListSkeletonExample />,
  },
};

export const WithUserWithMobileLoading: Story = {
  ...WithUserLoading,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
