import { Meta, StoryObj } from '@storybook/react';
import { Table, TableSkeleton } from './Table';
import { TableExample } from './examples';

const meta = {
  title: 'Molecules/Table',
  component: Table,
  render: TableExample,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
};

export const Skeleton: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <TableSkeleton rows={8} cols={4} />,
};

export const SkeletonDistinct: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="distinct bg-distinct">
      <TableSkeleton rows={8} cols={4} />
    </div>
  ),
};
