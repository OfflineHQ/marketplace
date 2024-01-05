import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import { createMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { CartCancelled } from './CartCancelled';
import {
  CartCancelledExample,
  passOrder1,
  passOrder2,
  passOrderWithEvent2,
} from './examples';

const meta: Meta<typeof CartCancelled> = {
  render: CartCancelledExample,
  component: CartCancelled,
  args: {
    passes: [passOrder1, passOrder2],
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

type Story = StoryObj<typeof CartCancelled>;

export const Default: Story = {
  play: async (context) => {
    expect(await screen.findByText(/Lorem ipsum/i)).toBeInTheDocument();
  },
};

export const DefaultMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  ...Default,
};

export const WithSeveralEvents: Story = {
  args: {
    passes: [passOrder1, passOrder2, passOrderWithEvent2],
  },
};
