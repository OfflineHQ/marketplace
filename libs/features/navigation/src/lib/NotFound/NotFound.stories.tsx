import type { Meta, StoryObj } from '@storybook/react';
import { NotFound } from './NotFound';
import { NotFoundExample } from './examples';

const meta: Meta<typeof NotFound> = {
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
  },
  render: NotFoundExample,
};

export default meta;

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
