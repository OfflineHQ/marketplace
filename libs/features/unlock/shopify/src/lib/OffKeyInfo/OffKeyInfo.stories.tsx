import { StoryObj, type Meta } from '@storybook/react';
import { OffKeyState } from '../types';
import { OffKeyInfo } from './OffKeyInfo';

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
