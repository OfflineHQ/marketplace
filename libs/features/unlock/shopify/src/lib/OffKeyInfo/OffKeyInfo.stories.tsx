import { OffKeyState } from '@next/iframe';
import { StoryObj, type Meta } from '@storybook/react';
import React from 'react';
import { OffKeyInfo } from './OffKeyInfo';
import { OffKeyInfoSkeleton } from './OffKeyInfoSkeleton';

const meta = {
  component: OffKeyInfo,
  parameters: {
    layout: 'centered',
  },
  args: {
    offKeyName: 'Dummy Brand OffKey',
  },
} satisfies Meta<typeof OffKeyInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <OffKeyInfo {...args} state={OffKeyState.Unlocked} />
      <OffKeyInfo {...args} state={OffKeyState.Unlocking} />
      <OffKeyInfo {...args} state={OffKeyState.Used} />
      <OffKeyInfo {...args} state={OffKeyState.Locked} />
    </div>
  ),
};

export const Skeleton: Story = {
  render: (args) => <OffKeyInfoSkeleton />,
};
