import {
  passPurchaseContainerProps,
  PassPurchaseSheetContainerExample,
  PassPurchaseSheetContainerWithFullSizeExample,
} from './examples';
import { PassPurchaseSheetContainer } from './PassPurchaseSheetContainer';

import { Meta, StoryObj } from '@storybook/react';
import { default as passPurchaseMeta } from '../PassPurchase/PassPurchase.stories';

const meta = {
  component: PassPurchaseSheetContainerExample,
  args: passPurchaseContainerProps,
  parameters: passPurchaseMeta.parameters,
  render: PassPurchaseSheetContainerExample,
} satisfies Meta<typeof PassPurchaseSheetContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFullSize: Story = {
  render: PassPurchaseSheetContainerWithFullSizeExample,
};
