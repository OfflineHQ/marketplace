// PassCard.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { graphql } from 'msw';
import { PassCard, PassCardProps, PassCardSkeleton } from './PassCard';
import {
  PassCardBoundaryMaxExample,
  PassCardBoundaryMaxPerUserExample,
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
} from './examples';

const meta = {
  component: PassCard,
  args: {
    organizerSlug: 'organizer-slug',
    eventSlug: 'event-slug',
    ...passWithMaxAmount,
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query('GetEventPassOrderSums', (req, res, ctx) => {
          return ctx.data({
            eventPassOrderSums_by_pk: {
              totalReserved: 0,
            },
          });
        }),
        graphql.query('GetPendingOrderForEventPass', (req, res, ctx) => {
          return ctx.data({
            pendingOrder: null,
          });
        }),
        graphql.query('GetOrderPurchasedForEventPassesId', (req, res, ctx) => {
          return ctx.data({
            order: [],
          });
        }),
      ],
    },
  },
} satisfies Meta<PassCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('GetEventPassOrderSums', (req, res, ctx) => {
          return ctx.data({
            eventPassOrderSums_by_pk: {
              totalReserved: 0,
            },
          });
        }),
        graphql.query('GetPendingOrderForEventPass', (req, res, ctx) => {
          return ctx.data({
            pendingOrder: null,
          });
        }),
        graphql.query('GetOrderPurchasedForEventPassesId', (req, res, ctx) => {
          return ctx.data({
            order: [],
          });
        }),
      ],
    },
  },
};

export const BoundaryConditions: Story = {
  ...Default,
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters.msw.handlers,
        graphql.query('GetPendingOrderForEventPass', (req, res, ctx) => {
          return ctx.json({
            pendingOrder: { quantity: 6 },
          });
        }),
      ],
    },
  },
  render: PassCardBoundaryMaxExample,
  // play: async () => {
  //   const incrementButton = await screen.findByRole('button', {
  //     name: /increment value/i,
  //   });
  //   expect(incrementButton).toBeDisabled();
  //   const decrementButton = screen.getByRole('button', {
  //     name: /decrement value/i,
  //   });
  //   expect(decrementButton).not.toBeDisabled();
  // },
};

export const BoundaryConditionsPerUser: Story = {
  args: passWithMaxAmountPerUser,
  render: PassCardBoundaryMaxPerUserExample,
  // play: async (context) => {
  //   if (BoundaryConditions.play) await BoundaryConditions.play(context);
  // },
};

export const SoldOut: Story = {
  args: passWithSoldOut,
  // play: async () => {
  //   const soldOut = await screen.findByText(/sold-out/i);
  //   expect(soldOut).toBeInTheDocument();
  // },
};

export const Loading: Story = {
  render: () => <PassCardSkeleton />,
};

//TODO add story and handle the case when local cart pass is more than what's available !
