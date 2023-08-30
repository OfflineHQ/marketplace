import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import {
  AlertDemo,
  AlertDestructive,
  AlertWarning,
  AlertSuccess,
  AlertInfo,
} from './examples';

const meta = {
  component: Alert,
  title: 'Molecules/Alert',
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: AlertDemo,
};

export const Destructive: Story = {
  render: AlertDestructive,
  args: {
    variant: 'destructive',
  },
};

export const Success: Story = {
  render: AlertSuccess,
  args: {
    variant: 'success',
  },
};

export const Warning: Story = {
  render: AlertWarning,
  args: {
    variant: 'warning',
  },
};

export const Info: Story = {
  render: AlertInfo,
  args: {
    variant: 'info',
  },
};
