import type { Meta, StoryObj } from '@storybook/react';

import { EventsTableExample, eventsTableData } from './examples';

import { EventsTable } from './EventsTable';

const meta: Meta<typeof EventsTable> = {
  component: EventsTable,
  parameters: {
    layout: 'fullscreen',
  },
  render: EventsTableExample,
  args: {
    events: eventsTableData,
  },
};

export default meta;

type Story = StoryObj<typeof EventsTable>;

export const Default: Story = {};

export const WithMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
