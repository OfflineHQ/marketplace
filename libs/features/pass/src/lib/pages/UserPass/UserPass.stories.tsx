import type { Meta, StoryObj } from '@storybook/react';

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

export const WithUserDarkModeMobile: Story = {
  ...WithUser,
  parameters: {
    darkMode: {
      isDark: true,
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
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
