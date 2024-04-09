import { StoryObj, type Meta } from '@storybook/react';
import { OffKeyHeader } from './OffKeyHeader';

const meta = {
  component: OffKeyHeader,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OffKeyHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotConnected: Story = {
  args: {
    title: 'Locked with the Dummy Brand OffKey',
  },
};
