import type { Meta, StoryObj } from '@storybook/react';
import { Error } from './Error';
import { ErrorExample } from './examples';

const meta: Meta<typeof Error> = {
  component: Error,
  parameters: {
    layout: 'fullscreen',
  },
  render: ErrorExample,
  args: {
    error: {
      name: 'Error name',
      message: 'Error message',
      digest: 'dummy error digest',
    },
    reset: () => null,
  },
};

export default meta;

type Story = StoryObj<typeof Error>;

export const Default: Story = {};
