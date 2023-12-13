import type { Meta, StoryObj } from '@storybook/react';

import { expect, screen, userEvent, within } from '@storybook/test';
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

export const Default: Story = {
  play: async ({ container }) => {
    const textElement = await screen.findAllByText(/Tech Conference/i);
    expect(textElement[0]).toBeInTheDocument();
    const buttonFileRow = within(
      textElement[0].closest('tr') as HTMLElement,
    ).getByRole('button');
    userEvent.click(buttonFileRow);
    const fileActionEdit = await screen.findByText(/Edit/i);
    userEvent.click(fileActionEdit);
  },
};

export const WithMobile: Story = {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
