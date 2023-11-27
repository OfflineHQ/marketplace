import type { Meta, StoryObj } from '@storybook/react';

import {
  EventSheetExample,
  EventSheetSkeletonExample,
  event,
} from './examples';

import { EventSheet } from './EventSheet';

const meta: Meta<typeof EventSheet> = {
  component: EventSheet,
  parameters: {
    layout: 'fullscreen',
  },
  render: EventSheetExample,
  args: {
    event,
  },
};

export default meta;

type Story = StoryObj<typeof EventSheet>;

export const Default: Story = {};

export const WithMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Skeleton: Story = {
  render: () => <EventSheetSkeletonExample />,
};
