// PassCard.stories.tsx
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { screen } from '@storybook/testing-library';
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
        graphql.query(
          'GetEventPassPendingOrderForEventPass',
          (req, res, ctx) => {
            return ctx.data({
              eventPassPendingOrder: null,
            });
          },
        ),
        graphql.query(
          'GetEventPassOrdersConfirmedOrCompletedForEventPassId',
          (req, res, ctx) => {
            return ctx.data({
              eventPassOrder: [],
            });
          },
        ),
      ],
    },
  },
} satisfies Meta<PassCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BoundaryConditions: Story = {
  ...Default,
  render: PassCardBoundaryMaxExample,
  play: async () => {
    const incrementButton = await screen.findByRole('button', {
      name: /increment value/i,
    });
    expect(incrementButton).toBeDisabled();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    expect(decrementButton).not.toBeDisabled();
  },
};

export const BoundaryConditionsPerUser: Story = {
  args: passWithMaxAmountPerUser,
  render: PassCardBoundaryMaxPerUserExample,
  play: async (context) => {
    if (BoundaryConditions.play) await BoundaryConditions.play(context);
  },
};

export const SoldOut: Story = {
  args: passWithSoldOut,
  play: async () => {
    const soldOut = await screen.findByText(/sold-out/i);
    expect(soldOut).toBeInTheDocument();
  },
};

export const Loading: Story = {
  render: () => <PassCardSkeleton />,
};

//TODO add story and handle the case when local cart pass is more than what's available !
