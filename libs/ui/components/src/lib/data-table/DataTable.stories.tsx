import { Meta, StoryObj } from '@storybook/react';

import { expect, screen, userEvent, within } from '@storybook/test';
import { Delete } from '@ui/icons';
import { sleep } from '@utils';
import { Card } from '../card/Card';
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
  parameters: {
    chromatic: {
      modes: {
        mobile: {
          disable: true,
        },
      },
    },
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
  play: async ({ args, canvasElement }) => {
    await userEvent.click(screen.getByRole('button', { name: /priority/i }));
    const dropdown = within(screen.getByRole('menu'));
    await userEvent.click(dropdown.getByText(/sort descending/i));
    expect(args.onSortingChange).toHaveBeenCalledWith([
      {
        id: 'priority',
        desc: true,
      },
    ]);
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

export const DataTableWithToolbarSearchNoResult: Story = {
  args: {
    ...DataTableWithToolbarSearch.args,
  },
  play: async ({ canvasElement }) => {
    await userEvent.type(
      screen.getByPlaceholderText(/filter tasks/i),
      'dummy test',
    );
    expect(screen.getByText(/No results./i)).toBeInTheDocument();
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
  play: async ({ args, canvasElement }) => {
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
    expect(args.onColumnFiltersChange).toHaveBeenCalledWith([
      {
        id: 'priority',
        value: ['low', 'medium', 'high'],
      },
      {
        id: 'status',
        value: ['done'],
      },
    ]);
  },
};

export const DataTableWithToolbarToggleColumns: Story = {
  args: {
    ...DataTableWithToolbarFilters.args,
    toolbarProps: {
      ...DataTableWithToolbarFilters.args.toolbarProps,
      toggleColumnsText: {
        view: 'View',
        toggleColumns: 'Toggle columns',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(screen.getByRole('button', { name: /view/i }));
    const dropdown = within(screen.getByRole('menu'));
    await userEvent.click(dropdown.getByText(/Priority/i));
    expect(screen.queryByText(/High/i)).not.toBeInTheDocument();
    await userEvent.click(await screen.findByRole('button', { name: /view/i }));
  },
};

export const DataTableWithNoData: Story = {
  args: {
    ...DataTableWithToolbarToggleColumns.args,
    data: [],
  },
  play: async ({ canvasElement }) => {
    expect(screen.getByText(/No results./i)).toBeInTheDocument();
    expect(screen.queryByRole('input', { name: /filter tasks/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Next page/i })).toBeNull();
  },
};

export const DataTableWithSelectedRows: Story = {
  ...DataTableWithToolbarToggleColumns,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select all/i }),
    );
    expect(screen.getByText(/10 of 100 selected/i)).toBeInTheDocument();
  },
};

export const DataTableWithSelectedRowsDark: Story = {
  ...DataTableWithSelectedRows,
  play: async ({ canvasElement }) => {
    await sleep(100);
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select all/i }),
    );
    expect(screen.getByText(/10 of 100 selected/i)).toBeInTheDocument();
  },
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
};

export const DataTableWithSelectedRowsAndActions: Story = {
  args: {
    ...DataTableWithSelectedRows.args,
    toolbarProps: {
      ...DataTableWithSelectedRows.args?.toolbarProps,
      menuActions: {
        helperText: 'Select an action',
        items: [
          {
            type: 'item',
            icon: <Delete />,
            text: 'Delete those tasks',
          },
        ],
      },
    },
  },
  play: async (context) => {
    await DataTableWithSelectedRowsDark.play(context);
    userEvent.click(
      await screen.findByRole('button', {
        name: /Menu Actions/i,
      }),
    );
  },
};

export const InsideCardDistinct: Story = {
  args: {
    ...DataTableWithToolbarToggleColumns.args,
  },
  render: (props) => {
    return (
      <Card variant="distinct" className="m-0 h-full p-4">
        <DataTable {...props} />
      </Card>
    );
  },
};

export const InsideCardDistinctSelectedRows: Story = {
  ...InsideCardDistinct,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select all/i }),
    );
    expect(screen.getByText(/10 of 100 selected/i)).toBeInTheDocument();
  },
};

export const InsideCardDistinctSelectedRowsDark: Story = {
  ...InsideCardDistinctSelectedRows,
  play: async ({ canvasElement }) => {
    await sleep(100);
    await userEvent.click(
      screen.getByRole('checkbox', { name: /select all/i }),
    );
    expect(screen.getByText(/10 of 100 selected/i)).toBeInTheDocument();
  },
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
};

export const WithInitData: Story = {
  args: {
    ...DataTableWithToolbarToggleColumns.args,
    selectKey: 'id',
    initialRowSelection: {
      'TASK-1907': true,
      'TASK-7839': true,
      'TASK-6938': true,
    },
    initialColumnFilters: [
      {
        id: 'status',
        value: ['backlog', 'todo'],
      },
      {
        id: 'priority',
        value: ['high'],
      },
    ],
    initialSorting: [
      {
        id: 'title',
        desc: false,
      },
    ],
  },
  play: async ({ args, canvasElement, parameters }) => {
    const task1907 = screen.getByText('TASK-1907');
    const task1907Row = task1907.closest('tr') as HTMLElement;
    expect(task1907Row).toBeInTheDocument();
    await expect(task1907Row).toHaveAttribute('data-state', 'selected');
    const checkbox = within(task1907Row).getByRole('checkbox');
    await expect(checkbox).toBeChecked();
    expect(screen.getByText(/3 of 17 selected/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Next page/i }));
    const task6938 = screen.getByText('TASK-6938');
    const task6938Row = task6938.closest('tr') as HTMLElement;
    expect(task6938Row).toBeInTheDocument();
    await expect(task6938Row).toHaveAttribute('data-state', 'selected');
    const checkbox6938 = within(task6938Row).getByRole('checkbox');
    await expect(checkbox6938).toBeChecked();

    const task7839 = screen.getByText('TASK-7839');
    const task7839Row = task7839.closest('tr') as HTMLElement;
    expect(task7839Row).toBeInTheDocument();
    await expect(task7839Row).toHaveAttribute('data-state', 'selected');
    const checkbox7839 = within(task7839Row).getByRole('checkbox');
    await expect(checkbox7839).toBeChecked();
    const task9549 = screen.getByText('TASK-9549');
    const task9549Row = task9549.closest('tr') as HTMLElement;
    expect(task9549Row).toBeInTheDocument();
    const checkbox9549 = within(task9549Row).getByRole('checkbox');
    await userEvent.click(checkbox9549);
    await expect(checkbox9549).toBeChecked();
    expect(screen.getByText(/4 of 17 selected/i)).toBeInTheDocument();
    expect(args.onRowSelectionChange).toHaveBeenCalledWith({
      'TASK-1907': true,
      'TASK-6938': true,
      'TASK-7839': true,
      'TASK-9549': true,
    });
  },
};
