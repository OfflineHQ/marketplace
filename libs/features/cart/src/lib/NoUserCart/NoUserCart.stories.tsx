import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import { createMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { NoUserCart } from './NoUserCart';
import { NoUserCartExample, allPassesCart } from './examples';

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

export const SectionWithNoUserNoCartMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'small_mobile',
    },
    chromatic: {
      modes: {
        mobile: {
          viewport: 'small_mobile',
        },
      },
    },
  },
  ...SectionWithNoUserNoCart,
};

export const SectionWithNoUserWithPasses: Story = {
  args: {
    allPassesCart,
  },
  play: async (context) => {
    await screen.findByRole('button', {
      name: /Lorem ipsum/i,
    });
    await screen.findByRole('button', {
      name: /World Cup/i,
    });
  },
};

export const SectionWithNoUserWithPassesMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'small_mobile',
    },
    chromatic: {
      modes: {
        mobile: {
          viewport: 'small_mobile',
        },
      },
    },
  },
  ...SectionWithNoUserWithPasses,
};

export const SectionWithNoUserLoading: Story = {
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
    await screen.findByText(/Loading/i);
  },
};
