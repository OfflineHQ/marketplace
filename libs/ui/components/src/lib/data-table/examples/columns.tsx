'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '../../badge/Badge';
import { Checkbox } from '../../checkbox/Checkbox';

import { sleep } from '@utils';
import { DataTableColumnHeader } from '../DataTableColumnHeader';
import {
  DataTableRowActions,
  DataTableRowActionsProps,
} from '../DataTableRowActions';
import { labels, priorities, statuses } from './data/data';
import { Task, taskSchema } from './data/schema';

const controlText = {
  asc: 'Sort ascending',
  desc: 'Sort descending',
  hide: 'Hide column',
};

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Task"
        controlText={controlText}
      />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Title"
        controlText={controlText}
      />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.text}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        controlText={controlText}
      />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.text}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Priority"
        controlText={controlText}
      />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority'),
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.text}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const task = taskSchema.parse(row.original);
      const items = [
        {
          type: 'item',
          text: 'Edit',
          action: () => sleep(1000),
        },
        {
          type: 'item',
          text: 'Make a copy',
          action: () => sleep(1000),
        },

        {
          type: 'item',
          text: 'Favorite',
          action: () => sleep(1000),
        },
        {
          type: 'separator',
        },
        {
          type: 'sub-radios',
          text: 'Labels',
          value: task.label,
          subItems: labels.map((label) => ({
            type: 'item',
            text: label.text,
            value: label.value,
            action: () => sleep(1000),
          })),
        },
        {
          type: 'separator',
        },
        {
          type: 'item',
          text: 'Delete',
          action: () => sleep(1000),
          shortcut: '⌘⌫',
        },
      ] satisfies DataTableRowActionsProps['items'];
      return <DataTableRowActions helperText="Open" items={items} />;
    },
  },
];
