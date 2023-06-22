// Event.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Event } from './Event';
import {
  eventProps,
  event2Props,
  EventExample,
  EventLoadingExample,
} from './examples';

const meta = {
  component: Event,
  args: eventProps,
  render: EventExample,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Event>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Event2: Story = {
  args: event2Props,
};

export const Loading: Story = {
  render: () => <EventLoadingExample />,
};

export const WithDarkMode: Story = {
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
  ...Default,
};

export const WithMobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  ...Default,
};
export const WithMobileDarkMode = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    darkMode: {
      isDark: true,
    },
  },
  ...Default,
};

export const WithMobileLoading = {
  ...WithMobile,
  ...Loading,
};
