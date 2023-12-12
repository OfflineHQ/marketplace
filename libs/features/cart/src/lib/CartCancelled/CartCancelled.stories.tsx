import type { Meta, StoryObj } from '@storybook/react';
import { graphql } from 'msw';

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
    msw: {
      handlers: [
        graphql.query('GetEventWithPasses', (req, res, ctx) => {
          return ctx.data({
            event: null,
          });
        }),
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CartCancelled>;

export const Default: Story = {};

export const WithSeveralEvents: Story = {
  args: {
    passes: [passOrder1, passOrder2, passOrderWithEvent2],
  },
};
