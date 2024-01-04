import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import {
  eventParametersDelayedReveal,
  eventParametersDelayedRevealRevealed,
} from '../UserPassEvent/examples';
import { UserPassList } from './UserPassList';
import {
  UserPassListExample,
  UserPassListSkeletonExample,
  actionsFunctions,
  batchDownloadOrReveal,
  eventParameters,
  eventParameters2,
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
    await screen.findByText(/Lorem/i);
    screen.getByText(/Jan 1, 2021/i);
    screen.getByText(/Jan 3, 2021/i);
    // screen.getByText(/3 passes/i);
    // screen.getByText(/x1 not revealed/i);
    // screen.getByText(/x2 revealed/i);
    screen.getByText(/Family/i);
    // screen.getByText(/#1,198/i);
    screen.getByText(/Weekend/i);
    // const pass3Text = screen.getByText(/#3/i);
    //   const parentDiv = pass3Text.parentElement;
    //   if (parentDiv) {
    //     const button = within(parentDiv).getByRole('button');
    //     userEvent.click(button);
    //   }
    //   await screen.findByText(/details/i);
  },
};

export const WithMultipleEvents: Story = {
  ...WithSingleEvent,
  args: {
    eventsParameters: [eventParameters, eventParameters2],
  },
  play: async () => undefined,
};

export const WithDelayedRevealNotRevealed: Story = {
  args: {
    eventsParameters: [eventParametersDelayedReveal],
  },
  play: async ({ canvasElement }) => {
    await screen.findByText(/World cup/i);
    expect(screen.queryByText(/revealed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/download/i)).not.toBeInTheDocument();
    //TODO use something similar to `clickOnRevealButton` to check that reveal button is not in list of actions
  },
};

export const WithDelayedRevealRevealed: Story = {
  args: {
    eventsParameters: [eventParametersDelayedRevealRevealed],
  },
  play: async ({ canvasElement }) => {
    await screen.findByText(/World cup/i);
    expect(screen.getAllByText(/revealed/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/revealed/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/revealed/i)[2]).toBeInTheDocument();
    expect(screen.getAllByText(/revealed/i)[3]).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i }),
    ).toBeInTheDocument();
    //TODO use something similar to `clickOnRevealButton` to check that reveal button is in list of actions
  },
};

export const WithSkeleton: Story = {
  render: UserPassListSkeletonExample,
};
