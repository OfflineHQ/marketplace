import { TextInput } from './TextInput';
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: TextInput,
  title: 'Atoms/TextInput',
} satisfies Meta<typeof TextInput>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
