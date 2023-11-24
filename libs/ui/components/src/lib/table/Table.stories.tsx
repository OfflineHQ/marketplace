import { Meta, StoryObj } from '@storybook/react';
import { TableExample } from './examples';
import { Table, TableSkeleton } from './Table';

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

export const SkeletonHighlight: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <TableSkeleton rows={8} cols={4} variant="highlight" />,
};
