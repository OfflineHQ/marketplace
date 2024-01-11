import * as eventApi from '@features/organizer/event-api';
import {
  passPurchaseContainerProps,
  PassPurchaseSheetContainerExample,
  PassPurchaseSheetContainerWithFullSizeExample,
} from './examples';
import { PassPurchaseSheetContainer } from './PassPurchaseSheetContainer';

import { Meta, StoryObj } from '@storybook/react';
import { getMock } from 'storybook-addon-module-mock';
import {
  default as passPurchaseMeta,
  WithLotsOfPassesSelected,
} from '../PassPurchase/PassPurchase.stories';
import { mobileMode } from '@test-utils/storybook';

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
