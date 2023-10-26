import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { EventPassList } from './EventPassList';
import { EventPassListExample, EventPassListLoadingExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof EventPassList> = {
  component: EventPassList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof EventPassList>;

export const Default: Story = {
  render: EventPassListExample,
  play: async () => {
    await screen.findByText(/1 pass/i);
    expect(screen.getByText(/Lorem ipsum/i));
    expect(screen.getByText(/World cup/i));
    expect(screen.getByText(/5 passes/i));
  },
};

export const Opened: Story = {
  ...Default,
  play: async () => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Lorem ipsum/i,
      }),
    );
    await screen.findByText(/1 x/i);
    await screen.findByText(/General Admission/i);
    await userEvent.click(
      await screen.findByRole('button', {
        name: /World cup/i,
      }),
    );
    await screen.findByText(/3 x/i);
    await screen.findByText(/Premium Pass/i);
    await screen.findByText(/2 x/i);
    await screen.findByText(/Family Pass/i);
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
    const editButtons = await screen.findAllByRole('button', {
      name: /Edit/i,
    });
    expect(editButtons).toHaveLength(2);
  },
};

export const Remove: Story = {
  ...Opened,
  play: async (context) => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Lorem ipsum/i,
      }),
    );
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    userEvent.click(removeButtons[0]);
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      }),
    );
    expect(
      await screen.findByRole('button', {
        name: /World cup/i,
      }),
    );
  },
};

export const Loading: Story = {
  render: EventPassListLoadingExample,
};
