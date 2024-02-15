import { createMock } from 'storybook-addon-module-mock';
import * as kycApi from '../actions/initKyc';
import { SumsubDialog } from './SumsubDialog';
import { SumsubDialogExample, sumsubDialogProps } from './examples';

import { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: SumsubDialog,
  args: sumsubDialogProps,
  render: SumsubDialogExample,
  parameters: {
    moduleMock: {
      mock: () => {
        const mockKyc = createMock(kycApi, 'initKyc');
        mockKyc.mockReturnValue({
          user: {},
          accessToken: 'accessToken',
        });
        return [mockKyc];
      },
    },
  },
} satisfies Meta<typeof SumsubDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
