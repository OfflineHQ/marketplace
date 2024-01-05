import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import { createMock, getMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { NoUserCart } from './NoUserCart';
import { NoUserCartExample } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof NoUserCart> = {
  component: NoUserCart,
  render: NoUserCartExample,
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
        return [mock];
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NoUserCart>;

export const SectionWithNoUserNoCart: Story = {
  play: async (context) => {
    expect(
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: /World Cup/i,
      }),
    ).toBeNull();
    await screen.findByText(/You don't have anything in your cart yet/i);
  },
};

export const SectionWithNoUserLoading: Story = {
  args: {
    getAllPassesCart: () =>
      Promise.resolve({
        'organizer-slug': {
          'event-slug': [],
        },
      }),
  },
  play: async (context) => {
    const mockGetEventWithPasses = getMock(
      context.parameters,
      cartApi,
      'getEventWithPasses',
    );
    mockGetEventWithPasses.mockImplementation(() => new Promise({} as any));
    expect(
      screen.queryByRole('button', {
        name: /Lorem ipsum/i,
      }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: /World Cup/i,
      }),
    ).toBeNull();
    await screen.findByText(/Loading/i);
  },
};
