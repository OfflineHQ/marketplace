import {
  passPurchaseContainerProps,
  PassPurchaseSheetContainerExample,
  PassPurchaseSheetContainerWithFullSizeExample,
} from './examples';
import { PassPurchaseSheetContainer } from './PassPurchaseSheetContainer';

import { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: PassPurchaseSheetContainerExample,
  args: passPurchaseContainerProps,
  render: PassPurchaseSheetContainerExample,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PassPurchaseSheetContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFullSize: Story = {
  render: PassPurchaseSheetContainerWithFullSizeExample,
};
