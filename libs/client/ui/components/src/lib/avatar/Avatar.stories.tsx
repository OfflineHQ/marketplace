import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarImage, AvatarFallback, avatarSizes, AvatarProps } from './Avatar';

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
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAvatar: Story = {
  args: {
    size: 'md',
  },
  render: (props) => (
    <Avatar {...props}>
      <AvatarImage src="https://github.com/sebpalluel.png" />
      <AvatarFallback>SP</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackAvatar: Story = {
  args: {
    size: 'md',
  },
  render: ({ size }) => (
    <Avatar size={size}>
      <AvatarImage src="https://github.com/!@£$%.png" />
      <AvatarFallback>FA</AvatarFallback>
    </Avatar>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <>
      {sizeOptions.map((size) => (
        <div key={size} className="mb-2">
          <Avatar size={size as AvatarProps['size']}>
            <AvatarImage src="https://github.com/sebpalluel.png" />
            <AvatarFallback>SP</AvatarFallback>
          </Avatar>
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
          <Avatar size={size as keyof typeof avatarSizes}>
            <AvatarImage src="https://github.com/!@£$%.png" />
            <AvatarFallback>FA</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </>
  ),
};
