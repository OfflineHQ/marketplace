import { StoryObj, type Meta } from '@storybook/react';
import { AvatarKey } from './AvatarKey';
const meta = {
  component: AvatarKey,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AvatarKey>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Key: Story = {
  args: {},
};

export const KeyOwned: Story = {
  args: {
    isOwned: true,
  },
};

export const KeyNotOwned: Story = {
  args: {
    isOwned: false,
  },
};
