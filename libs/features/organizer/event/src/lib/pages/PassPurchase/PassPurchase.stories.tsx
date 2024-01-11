// PassPurchaseSheet.stories.tsx
import * as eventApi from '@features/organizer/event-api';
import { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent } from '@storybook/test';
import { mobileMode } from '@test-utils/storybook';
import { createMock, getMock, render } from 'storybook-addon-module-mock';
import { default as passCardMeta } from '../../molecules/PassCard/PassCard.stories';
import { PassPurchaseSheet } from './PassPurchaseSheet';
import {
  PassPurchaseCardExample,
  PassPurchaseSheetExample,
  PassPurchaseSheetLoadingExample,
  passPurchaseProps,
  passPurchasePropsWithLotsOfPasses,
} from './examples';
import { eventProps } from '../Event/examples';

const meta = {
  component: PassPurchaseSheet,
  args: passPurchaseProps,
  render: PassPurchaseSheetExample,
  parameters: {
    ...passCardMeta.parameters,
    layout: 'fullscreen',
    moduleMock: {
      mock: () => {
        const mockGetEventPassesCart = createMock(
          eventApi,
          'getEventPassesCart',
        );
        mockGetEventPassesCart.mockResolvedValue([]);
        const mockGetEventPassCart = createMock(eventApi, 'getEventPassCart');
        mockGetEventPassCart.mockResolvedValue({
          quantity: 0,
        });
        return [
          ...passCardMeta.parameters.moduleMock.mock(),
          mockGetEventPassesCart,
          mockGetEventPassCart,
        ];
      },
    },
  },
} satisfies Meta<typeof PassPurchaseSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoPassSelected: Story = {
  play: async (context) => {
    const mockGetEventPassCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassCart',
    );
    mockGetEventPassCart.mockResolvedValue({
      quantity: 0,
    });
    const passCardIncrements = await screen.findAllByRole('button', {
      name: /increment value/i,
    });
    expect(passCardIncrements).toHaveLength(2);
    expect(screen.getAllByText('0')).toHaveLength(2);
  },
};

export const WithPurchaseInProcess: Story = {
  args: {
    hasConfirmedPasses: true,
  },
  play: async (context) => {
    // Here will check that the footer is not displayed if has confirmed passes even if user have some passes in the cart
    const mockGetEventPassesCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassesCart',
    );
    mockGetEventPassesCart.mockResolvedValue([
      {
        id: '1',
        eventPassId: '1',
        quantity: 1,
        created_at: new Date().toISOString(),
      },
    ]);
    render(context.parameters);
    expect(screen.getByText(/VIP Pass/i)).toBeInTheDocument();
    expect(await screen.findAllByText(/purchase ongoing/i)).toHaveLength(2);
    expect(screen.queryByText(/Go to payment/i)).not.toBeInTheDocument();
  },
};

export const SelectPasses: Story = {
  ...NoPassSelected,
  play: async (context) => {
    const mockGetEventPassCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassCart',
    );
    mockGetEventPassCart.mockResolvedValue({
      quantity: 0,
    });
    const mockGetEventPassesCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassesCart',
    );
    expect(await screen.findByText(/VIP Pass/i)).toBeInTheDocument();
    const passCards = await screen.findAllByRole('button', {
      name: /increment value/i,
    });
    expect(passCards).toHaveLength(2);
    await userEvent.click(passCards[0]); // Click the first pass increment button
    mockGetEventPassesCart.mockResolvedValue([
      {
        id: '1',
        eventPassId: '1',
        quantity: 1,
        created_at: new Date().toISOString(),
      },
    ]);
    render(context.parameters);
    const cartButton = await screen.findByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();
  },
};

export const WithLotsOfPasses: Story = {
  args: passPurchasePropsWithLotsOfPasses,
  play: async (context) => {
    const mockGetEventPassCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassCart',
    );
    mockGetEventPassCart.mockResolvedValue({
      quantity: 0,
    });
  },
};

export const WithLotsOfPassesSelected: Story = {
  ...WithLotsOfPasses,
  play: async (context) => {
    await WithLotsOfPasses.play(context);
    const mockGetEventPassesCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassesCart',
    );
    expect(await screen.findByText(/Premium pass/i)).toBeInTheDocument();
    const passCards = await screen.findAllByRole('button', {
      name: /increment value/i,
    });
    expect(passCards).toHaveLength(7);
    userEvent.click(passCards[1]); // Click the 2nd pass increment button
    await userEvent.click(passCards[5]); // Click the 6th pass increment button
    mockGetEventPassesCart.mockResolvedValue([
      {
        id: '1',
        eventPassId: '1',
        quantity: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        eventPassId: '2',
        quantity: 1,
        created_at: new Date().toISOString(),
      },
    ]);
    render(context.parameters);
    const cartButton = await screen.findByRole('button', {
      name: /Go to payment/i,
    });
    expect(cartButton).toBeInTheDocument();
  },
};

export const WithFullSizeAndBackButton: Story = {
  args: {
    ...WithLotsOfPasses.args,
    size: 'full',
  },
  play: async (context) => {
    await WithLotsOfPassesSelected.play(context);
    const mockGetEventPassCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassCart',
    );
    mockGetEventPassCart.mockResolvedValue({
      quantity: 0,
    });
    const backButton = await screen.findByRole('button', {
      name: /Go back to the event/i,
    });
    await expect(backButton).toBeVisible();
  },
};

export const Loading: Story = {
  render: PassPurchaseSheetLoadingExample,
};

export const LoadingFullSize: Story = {
  ...Loading,
  args: {
    size: 'full',
  },
};

export const Card: Story = {
  args: {
    backButtonLink: { href: '/dummy' },
    eventTitle: eventProps.title,
  },
  render: PassPurchaseCardExample,
  play: async (context) => {
    const mockGetEventPassCart = getMock(
      context.parameters,
      eventApi,
      'getEventPassCart',
    );
    mockGetEventPassCart.mockResolvedValue({
      quantity: 0,
    });
  },
};

export const CardWithLotsOfPassesSelected: Story = {
  ...WithLotsOfPassesSelected,
  args: {
    backButtonLink: { href: '/dummy' },
    ...WithLotsOfPassesSelected.args,
  },
  play: WithLotsOfPassesSelected.play,
  render: PassPurchaseCardExample,
};

export const CardWithLotsOfPassesSelectedMobile: Story = {
  ...CardWithLotsOfPassesSelected,
  parameters: {
    ...mobileMode,
  },
  args: {
    ...CardWithLotsOfPassesSelected.args,
  },
};
