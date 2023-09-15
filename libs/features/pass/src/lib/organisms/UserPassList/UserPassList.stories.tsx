import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';

import { UserPassList } from './UserPassList';
import {
  eventParameters,
  eventParameters2,
  UserPassListExample,
  UserPassListSkeletonExample,
  actionsFunctions,
  batchDownloadOrReveal,
} from './examples';

const meta: Meta<typeof UserPassList> = {
  component: UserPassList,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    eventsParameters: [eventParameters],
    actionsFunctions,
    batchDownloadOrReveal,
  },
};

export default meta;

type Story = StoryObj<typeof UserPassList>;

export const WithSingleEvent: Story = {
  render: UserPassListExample,
  play: async ({ canvasElement }) => {
    screen.getByText(/Lorem/i);
    screen.getByText(/Jan 1, 2021/i);
    screen.getByText(/Jan 3, 2021/i);
    screen.getByText(/3 passes/i);
    screen.getByText(/x1 not revealed/i);
    screen.getByText(/x2 revealed/i);
    screen.getByText(/Family/i);
    screen.getByText(/#1,198/i);
    screen.getByText(/Weekend/i);
    const pass3Text = screen.getByText(/#3/i);
    const parentDiv = pass3Text.parentElement;
    if (parentDiv) {
      const button = within(parentDiv).getByRole('button');
      userEvent.click(button);
    }
    await screen.findByText(/See details of the pass/i);
  },
};

export const WithMultipleEvents: Story = {
  ...WithSingleEvent,
  args: {
    eventsParameters: [eventParameters, eventParameters2],
  },
  play: async () => undefined,
};

export const WithSkeleton: Story = {
  render: UserPassListSkeletonExample,
};
