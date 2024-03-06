import { StoryObj, type Meta } from '@storybook/react';
import { KeyRequired } from './KeyRequired';
import { firstKey, secondKey } from './examples';

const meta = {
  component: KeyRequired,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof KeyRequired>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstKey: Story = {
  args: firstKey,
};

export const FirstKeyNotOwned: Story = {
  args: {
    ...firstKey,
    isOwned: false,
  },
};

export const SecondKeyOwned: Story = {
  args: {
    ...secondKey,
    isOwned: true,
  },
};
