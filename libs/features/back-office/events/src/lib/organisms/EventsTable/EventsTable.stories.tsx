import type { Meta, StoryObj } from '@storybook/react';

import { expect, screen, userEvent, within } from '@storybook/test';
import { EventsTableExample, eventsTableData } from './examples';

import { mobileMode } from '@test-utils/storybook';
import { EventsTable } from './EventsTable';

const meta: Meta<typeof EventsTable> = {
  component: EventsTable,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/campaigns/events',
      },
    },
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

export const WithMoreItems: Story = {
  play: async ({ container }) => {
    const spanElement = await screen.findByText(/10/i);
    userEvent.click(spanElement.closest('button') as HTMLElement);
    const optionList = await screen.findByRole('listbox');
    const item = within(optionList).getByRole('option', {
      name: '50',
    });
    await userEvent.dblClick(item);
  },
};

export const WithMobile: Story = {
  parameters: {
    layout: 'fullscreen',
    ...mobileMode,
  },
};
