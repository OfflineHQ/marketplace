// Icons.stories.tsx

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Icons from './index';
import { IconProps, iconCVA, iconSizes, iconColors } from './variants';

const meta: Meta = {
  title: 'UI/Icons',
  argTypes: {
    size: {
      options: Object.keys(iconSizes),
      control: { type: 'select' },
    },
    color: {
      options: Object.keys(iconColors),
      control: { type: 'select' },
    },
  },
} satisfies Meta<React.FC<IconProps>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: ({ size, color }: IconProps) => {
    const classIcon = iconCVA({ size, color });
    const colorText = iconColors[color || 'default'];
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {Object.entries(Icons).map(([name, Icon]) => (
          <div key={name} className="flex flex-col items-center justify-center px-4">
            <Icon className={`${classIcon}`} />
            <span className={`mt-2 ${colorText}`}>{name}</span>
          </div>
        ))}
      </div>
    );
  },
  args: {
    size: 'md',
  },
};

export const AllColors: Story = {
  render: ({ size }: IconProps) => {
    const Icon = Icons.Check;
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {Object.entries(iconColors).map(([name, color]) => {
          const className = iconCVA({ size, color: name as keyof typeof iconColors });
          return (
            <div key={name} className="flex flex-col items-center justify-center px-4">
              <Icon className={className} />
              <span className={`mt-2 ${color}`}>{name}</span>
            </div>
          );
        })}
      </div>
    );
  },
  args: {
    size: 'md',
  },
  argTypes: {
    color: {
      control: false,
    },
  },
};

export const AllSizes: Story = {
  render: ({ color }: IconProps) => {
    const Icon = Icons.Check;
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {Object.entries(iconSizes).map(([name]) => {
          const className = iconCVA({ size: name as keyof typeof iconSizes, color });
          return (
            <div key={name} className="flex flex-col items-center justify-center px-4">
              <Icon className={className} />
              <span className={`mt-2`}>{name}</span>
            </div>
          );
        })}
      </div>
    );
  },
  args: {
    size: 'md',
  },
  argTypes: {
    color: {
      control: false,
    },
  },
};
