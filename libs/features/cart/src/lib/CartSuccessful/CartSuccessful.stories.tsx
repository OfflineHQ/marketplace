import * as cartApi from '@features/cart-api';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen } from '@storybook/test';

import { createMock } from 'storybook-addon-module-mock';
import { eventCart1Props, eventCart2Props } from '../EventPassList/examples';
import { CartSuccessful } from './CartSuccessful';
import {
  CartSuccessfulExample,
  passOrder1,
  passOrder2,
  passOrderWithEvent2,
} from './examples';

const meta: Meta<typeof CartSuccessful> = {
  render: CartSuccessfulExample,
  component: CartSuccessful,
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
  args: {
    passes: [passOrder1, passOrder2],
  },
};

export default meta;

type Story = StoryObj<typeof CartSuccessful>;

export const Default: Story = {
  play: async (context) => {
    expect(await screen.findByText(/Lorem ipsum/i)).toBeInTheDocument();
  },
};

export const DefaultMobile: Story = {
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
  ...Default,
};

export const WithSeveralEvents: Story = {
  args: {
    passes: [passOrder1, passOrder2, passOrderWithEvent2],
  },
};
