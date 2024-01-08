import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import { createMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { UserCart } from './UserCart';
import {
  UserCartExample,
  allPassesCartUser,
  userPassPendingOrders1,
} from './examples';

const meta: Meta<typeof UserCart> = {
  component: UserCart,
  args: {
    userPassPendingOrders: userPassPendingOrders1,
    allPassesCart: null,
  },
  render: UserCartExample,
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

type Story = StoryObj<typeof UserCart>;

export const SectionWithUserNoCart: Story = {
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

export const SectionWithUserNoCartMobile: Story = {
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
  ...SectionWithUserNoCart,
};

export const SectionWithUserOpened: Story = {
  args: {
    userPassPendingOrders: userPassPendingOrders1,
    allPassesCart: allPassesCartUser,
  },
  play: async (context) => {
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
  },
};

export const SectionWithUserOpenedMobile: Story = {
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
  ...SectionWithUserOpened,
};
