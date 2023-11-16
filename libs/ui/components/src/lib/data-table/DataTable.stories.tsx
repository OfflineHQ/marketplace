// import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
// import { fireEvent, screen, userEvent } from '@storybook/testing-library';

import { DataTable } from './DataTable';
import { columns } from './examples/columns';
import { tasks } from './examples/data/tasks';

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable,
  args: {
    data: tasks,
    columns,
    noResultsText: 'No results.',
  },
} as Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultDataTable: Story = {};
