import { Meta, StoryObj } from '@storybook/react';
import { TableExample } from './examples';
import { Table } from './Table';

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
