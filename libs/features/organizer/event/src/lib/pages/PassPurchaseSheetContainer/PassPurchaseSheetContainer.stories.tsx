import * as eventApi from '@features/organizer/event-api';
import { expect, screen, waitFor } from '@storybook/test';
import { PassPurchaseSheetContainer } from './PassPurchaseSheetContainer';
import {
  PassPurchaseSheetContainerExample,
  PassPurchaseSheetContainerWithFullSizeExample,
  passPurchaseContainerProps,
} from './examples';

import { Meta, StoryObj } from '@storybook/react';
import { mobileMode } from '@test-utils/storybook';
import { getMock } from 'storybook-addon-module-mock';
import {
  eventParametersSaleEnded,
  eventParametersSaleNotStarted,
} from '../../molecules/EventSaleDates/examples';
import {
  WithLotsOfPassesSelected,
  default as passPurchaseMeta,
} from '../PassPurchase/PassPurchase.stories';

const meta = {
  component: PassPurchaseSheetContainerExample,
  args: passPurchaseContainerProps,
  parameters: passPurchaseMeta.parameters,
  render: PassPurchaseSheetContainerExample,
} satisfies Meta<typeof PassPurchaseSheetContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
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

export const DefaultWithPassesSelected: Story = {
  play: async (context) => {
    await WithLotsOfPassesSelected.play(context);
  },
};

export const WithFullSize: Story = {
  render: PassPurchaseSheetContainerWithFullSizeExample,
};

export const DefaultMobile: Story = {
  parameters: {
    ...mobileMode,
  },
  render: PassPurchaseSheetContainerExample,
};

export const WithPassesSelectedMobile: Story = {
  ...DefaultWithPassesSelected,
  parameters: {
    ...mobileMode,
  },
};

export const WithEventEnded: Story = {
  args: {
    eventParameters: {
      isSaleOngoing: false,
      ...eventParametersSaleEnded,
    },
  },
  play: async (context) => {
    await waitFor(
      () => expect(screen.queryAllByText(/sale ended/i)?.length).toBe(7),
      {
        timeout: 5000,
      },
    );
  },
};

export const WithEventEndedMobile: Story = {
  ...WithEventEnded,
  parameters: {
    ...mobileMode,
  },
};

export const WithEventNotStarted: Story = {
  args: {
    eventParameters: {
      isSaleOngoing: false,
      ...eventParametersSaleNotStarted,
    },
  },
  play: async (context) => {
    await waitFor(
      () => expect(screen.queryAllByText(/not started/i)?.length).toBe(7),
      {
        timeout: 5000,
      },
    );
  },
};
