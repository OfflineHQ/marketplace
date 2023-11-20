import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';

import { screen, userEvent, within } from '@storybook/testing-library';
import { DataTable } from './DataTable';
import { columns } from './examples/columns';
import { priorities, statuses } from './examples/data/data';
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

const paginationControlText = {
  rowOf: 'of',
  rowSelected: 'selected',
  rowsPerPage: 'Rows per page',
  page: 'Page',
  pageOf: 'of',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
};

export const DefaultDataTable: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(screen.getByRole('button', { name: /priority/i }));
    const dropdown = within(screen.getByRole('menu'));
    await userEvent.click(dropdown.getByText(/sort descending/i));
  },
};

export const DataTableWithPagination: Story = {
  args: {
    paginationProps: {
      controlText: paginationControlText,
    },
  },
  play: async ({ canvasElement }) => {
    expect(screen.getByText('TASK-8782')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(screen.queryByText('TASK-8782')).not.toBeInTheDocument();
    expect(screen.getByText('Page 2 of 10')).toBeInTheDocument();
  },
};

export const DataTableWithToolbarSearch: Story = {
  args: {
    toolbarProps: {
      searchProps: {
        filterKey: 'title',
        placeholder: 'Filter tasks...',
      },
    },
    ...DataTableWithPagination.args,
  },
  play: async ({ canvasElement }) => {
    await userEvent.type(
      screen.getByPlaceholderText(/filter tasks/i),
      'try to hack',
    );
    expect(
      await screen.findByText(/Try to hack the HEX alarm/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Try to hack the XSS bandwidth/i),
    ).toBeInTheDocument();
  },
};

export const DataTableWithToolbarFilters: Story = {
  args: {
    ...DataTableWithToolbarSearch.args,
    toolbarProps: {
      ...DataTableWithToolbarSearch.args.toolbarProps,
      filtersConfig: [
        {
          id: 'status',
          title: 'Status',
          options: statuses,
        },
        {
          id: 'priority',
          title: 'Priority',
          options: priorities,
        },
      ],
      filtersConfigText: {
        reset: 'Reset',
        valueSelected: 'value selected',
        noResultFound: 'no result found',
        clearFilters: 'clear filters',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const filterButton = screen.getAllByRole('button', { name: /Priority/i });
    await userEvent.click(filterButton[0]);
    const dropdown = within(screen.getByRole('listbox'));
    await userEvent.click(dropdown.getByText(/low/i));
    await userEvent.click(dropdown.getByText(/medium/i));
    await userEvent.click(dropdown.getByText(/high/i));
    expect(screen.getByText(/3 value selected/i)).toBeInTheDocument();
    const filterButton2 = screen.getAllByRole('button', { name: /Status/i });
    await userEvent.click(filterButton2[0]);
    const dropdown2 = within(screen.getByRole('listbox'));
    await userEvent.click(dropdown2.getByText(/Done/i));
    expect(screen.queryAllByText(/In Progress/i).length).toBe(1);
  },
};

export const DataTableWithToolbarToggleColumns: Story = {
  args: {
    ...DataTableWithToolbarFilters.args,
    toolbarProps: {
      ...DataTableWithToolbarFilters.args.toolbarProps,
      showToggleColumns: true,
      toggleColumnsText: {
        view: 'View',
        toggleColumns: 'Toggle columns',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(screen.getByRole('button', { name: /view/i }));
    const dropdown = within(screen.getByRole('menu'));
    await userEvent.click(dropdown.getByText(/Priority/i));
    expect(screen.queryByText(/High/i)).not.toBeInTheDocument();
    await userEvent.click(await screen.findByRole('button', { name: /view/i }));
  },
};
