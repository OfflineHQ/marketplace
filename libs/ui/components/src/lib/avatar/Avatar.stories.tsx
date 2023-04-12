import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, avatarSizes } from './Avatar';
import { AvatarExample, AvatarFallbackExample } from './examples';

const sizeOptions = Object.keys(avatarSizes);

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      options: sizeOptions,
      control: { type: 'select' },
    },
  },
  render: AvatarExample,
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAvatar: Story = {
  args: {
    size: 'md',
  },
};

export const FallbackAvatar: Story = {
  args: {
    size: 'md',
  },
  render: AvatarFallbackExample,
};

export const AllSizes: Story = {
  render: () => (
    <>
      {Object.keys(avatarSizes).map((size) => (
        <div key={size} className="mb-2">
          <AvatarExample size={size as keyof typeof avatarSizes} />
        </div>
      ))}
    </>
  ),
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const FallbackAvatarSizes: Story = {
  render: () => (
    <>
      {Object.keys(avatarSizes).map((size) => (
        <div key={size} className="mb-2">
          <AvatarFallbackExample size={size as keyof typeof avatarSizes} />
        </div>
      ))}
    </>
  ),
};
