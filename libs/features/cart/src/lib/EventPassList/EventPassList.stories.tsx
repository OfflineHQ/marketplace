import * as cartActions from '@features/cart-actions';
import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { createMock, getMock } from 'storybook-addon-module-mock';

import { EventPassList } from './EventPassList';
import {
  EventPassListExample,
  EventPassListLoadingExample,
  eventCart1Props,
  eventCart2Props,
} from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof EventPassList> = {
  component: EventPassList,
  parameters: {
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mock = createMock(cartApi, 'getEventWithPasses');
        mock.mockImplementation(({ eventSlug, locale }) => {
          return Promise.resolve(
            eventCart1Props.slug === eventSlug
              ? eventCart1Props
              : eventCart2Props,
          );
        });
        const deleteMock = createMock(cartActions, 'deleteEventPasses');
        deleteMock.mockImplementation(() => Promise.resolve());

        return [mock, deleteMock];
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EventPassList>;

export const Default: Story = {
  render: EventPassListExample,
  play: async () => {
    // await screen.findByText(/1 pass/i);
    await screen.findByText(/Lorem ipsum/i);
    await screen.findByText(/World cup/i);
    // screen.getByText(/5 passes/i);
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
    await screen.findByText(/6 x/i);
    await screen.findByText(/General Admission/i);
    await userEvent.click(
      await screen.findByRole('button', {
        name: /World cup/i,
      }),
    );
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
    const deleteMock = getMock(
      context.parameters,
      cartActions,
      'deleteEventPasses',
    );
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    await userEvent.click(removeButtons[0]);
    expect(deleteMock).toHaveBeenCalledWith({
      organizerSlug: eventCart1Props.organizer.slug,
      eventSlug: eventCart1Props.slug,
      eventPassIds: eventCart1Props.eventPasses.map((pass) => pass.id),
    });
  },
};

export const Loading: Story = {
  render: EventPassListLoadingExample,
};
