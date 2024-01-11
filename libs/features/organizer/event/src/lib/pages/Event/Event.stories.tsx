// Event.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Event } from './Event';
import {
  EventExample,
  EventLoadingExample,
  event2Props,
  eventProps,
} from './examples';
import { darkMode, mobileMode } from '@test-utils/storybook';

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
    ...darkMode,
  },
  ...Default,
};

export const WithMobile = {
  parameters: {
    ...mobileMode,
  },
  ...Default,
};
export const WithMobileDarkMode = {
  parameters: {
    ...mobileMode,
    ...darkMode,
  },
  ...Default,
};

export const WithMobileLoading = {
  ...WithMobile,
  ...Loading,
};
