// PassTotal.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { PassTotal } from './PassTotal';
import { passTotalProps } from './examples';

const meta = {
  component: PassTotal,
  args: passTotalProps,
} satisfies Meta<typeof PassTotal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
