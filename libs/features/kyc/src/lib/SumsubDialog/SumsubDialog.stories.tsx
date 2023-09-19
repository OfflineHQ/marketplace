import { SumsubDialogExample, sumsubDialogProps } from './examples';
import { SumsubDialog } from './SumsubDialog';

import { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: SumsubDialog,
  args: sumsubDialogProps,
  render: SumsubDialogExample,
} satisfies Meta<typeof SumsubDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
