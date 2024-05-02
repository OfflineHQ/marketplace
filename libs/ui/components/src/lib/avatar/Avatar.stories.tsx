import type { Meta, StoryObj } from '@storybook/react';

import { avatars } from '@ui/shared';
import { Avatar, AvatarFallback, avatarSizes } from './Avatar';
import {
  AvatarExample,
  AvatarFallbackExample,
  AvatarSkeletonExample,
} from './examples';

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
  args: {
    size: 'default',
  },
  render: AvatarExample,
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAvatar: Story = {};

export const FallbackAvatar: Story = {
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

export const AllSizesSkeleton: Story = {
  render: () => (
    <>
      {Object.keys(avatarSizes).map((size) => (
        <div key={size} className="mb-2">
          <AvatarSkeletonExample size={size as keyof typeof avatarSizes} />
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

export const EmojiAvatars: Story = {
  render: (props) => (
    <div className="flex flex-wrap space-x-2 space-y-2">
      {avatars.map((avatar, index) => (
        <Avatar key={index} {...props} className="text-2xl">
          <AvatarFallback style={{ backgroundColor: avatar.color }}>
            {avatar.emoji}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
