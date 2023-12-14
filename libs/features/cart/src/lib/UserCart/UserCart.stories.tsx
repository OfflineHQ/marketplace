import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';

import { createMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { UserCart } from './UserCart';
import { UserCartExample, userPassPendingOrders1 } from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof UserCart> = {
  component: UserCart,
  args: {
    userPassPendingOrders: userPassPendingOrders1,
  },
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

export const SectionWithUserOpened: Story = {
  render: UserCartExample,
  play: async (context) => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Lorem ipsum/i,
      }),
    );
    await userEvent.click(
      await screen.findByRole('button', {
        name: /World cup/i,
      }),
    );
    const removeButtons = await screen.findAllByRole('button', {
      name: /Remove/i,
    });
    expect(removeButtons).toHaveLength(2);
  },
};
