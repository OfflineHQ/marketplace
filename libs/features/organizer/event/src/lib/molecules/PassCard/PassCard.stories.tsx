import { expect } from '@storybook/jest';
import { screen, userEvent } from '@storybook/test';
// PassCard.stories.tsx
import * as eventActions from '@features/organizer/event-actions';
import * as eventApi from '@features/organizer/event-api';
import { Meta, StoryObj } from '@storybook/react';
import { createMock, getMock } from 'storybook-addon-module-mock';
import { PassCard, PassCardProps, PassCardSkeleton } from './PassCard';
import {
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
    moduleMock: {
      mock: () => {
        const mockGetEventPassOrderSums = createMock(
          eventApi,
          'getEventPassOrderSums',
        );
        const mockGetOrderPurchasedForEventPass = createMock(
          eventApi,
          'getOrderPurchasedForEventPass',
        );
        const mockGetEventPassCart = createMock(eventApi, 'getEventPassCart');
        mockGetEventPassOrderSums.mockResolvedValue({
          totalReserved: 0,
        });
        mockGetOrderPurchasedForEventPass.mockResolvedValue([]);
        mockGetEventPassCart.mockResolvedValue({
          quantity: 7,
        });
        const mockUpdateEventPassCart = createMock(
          eventActions,
          'updateEventPassCart',
        );
        mockUpdateEventPassCart.mockResolvedValue(undefined);
        return [
          mockGetEventPassOrderSums,
          mockGetOrderPurchasedForEventPass,
          mockGetEventPassCart,
          mockUpdateEventPassCart,
        ];
      },
    },
  },
} satisfies Meta<PassCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async (context) => {
    const mock = getMock(context.parameters, eventApi, 'getEventPassCart');
    mock.mockResolvedValue({
      quantity: 0,
    });
    const mockUpdate = getMock(
      context.parameters,
      eventActions,
      'updateEventPassCart',
    );
    const incrementButton = await screen.findByRole('button', {
      name: /increment value/i,
    });
    await userEvent.click(incrementButton);
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    await userEvent.click(decrementButton);
    expect(mockUpdate).toBeCalledTimes(2);
    const args = mockUpdate.mock.calls[0][0];
    expect(args).toMatchObject({
      organizerSlug: 'organizer-slug',
      eventSlug: 'event-slug',
      eventPassId: '1',
      quantity: 1,
    });
    const args2 = mockUpdate.mock.calls[1][0];
    expect(args2).toMatchObject({
      organizerSlug: 'organizer-slug',
      eventSlug: 'event-slug',
      eventPassId: '1',
      quantity: 0,
    });
  },
};

export const BoundaryConditions: Story = {
  play: async () => {
    const incrementButton = await screen.findByRole('button', {
      name: /increment value/i,
    });
    await expect(incrementButton).toBeDisabled();
    const decrementButton = screen.getByRole('button', {
      name: /decrement value/i,
    });
    await expect(decrementButton).toBeEnabled();
  },
};

export const BoundaryConditionsPerUser: Story = {
  args: passWithMaxAmountPerUser,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async (context) => {
    const mock = getMock(context.parameters, eventApi, 'getEventPassCart');
    mock.mockResolvedValue({
      quantity: 3,
    });
    if (BoundaryConditions.play) await BoundaryConditions.play(context);
  },
};

export const SoldOut: Story = {
  args: passWithSoldOut,
  play: async ({ parameters }) => {
    const mockSums = getMock(parameters, eventApi, 'getEventPassOrderSums');
    mockSums.mockResolvedValue({
      totalReserved: 10,
    });
    const soldOut = await screen.findByText(/sold out/i);
    expect(soldOut).toBeInTheDocument();
  },
};

export const Loading: Story = {
  render: () => <PassCardSkeleton />,
};

//TODO add story and handle the case when local cart pass is more than what's available !
