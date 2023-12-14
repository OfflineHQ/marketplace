'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/Table';

import { cn } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';
import {
  DataTablePagination,
  type DataTablePaginationProps,
} from './DataTablePagination';
import {
  DataTableToolbar,
  type DataTableToolbarProps,
} from './DataTableToolbar';

const variants = {
  default: 'border',
  insideDistinct: 'border-highlight',
};
const dataTableVariantsCva = cva('', {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface DataTableProps<TData, TValue>
  extends VariantProps<typeof dataTableVariantsCva> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showHeader?: boolean;
  toolbarProps?: Omit<DataTableToolbarProps<TData, TValue>, 'table'>;
  paginationProps?: Omit<DataTablePaginationProps<TData>, 'table'>;
  noResultsText: string;
}

export function DataTable<TData, TValue>({
  variant = 'default',
  className,
  columns,
  data,
  showHeader = true,
  toolbarProps,
  paginationProps,
  noResultsText,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const hasSelectionColumn = columns.some((column) => column.id === 'select');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: hasSelectionColumn,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className={cn('space-y-4', className)}>
      {toolbarProps ? (
        <DataTableToolbar table={table} {...toolbarProps} />
      ) : null}
      <div
        className={cn(
          'flex h-full grow overflow-auto rounded-md',
          dataTableVariantsCva({ variant }),
        )}
      >
        <Table>
          {showHeader ? (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          ) : null}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      align={(cell.column.columnDef.meta as any)?.align}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {noResultsText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginationProps ? (
        <DataTablePagination
          table={table}
          enableRowSelection={hasSelectionColumn}
          {...paginationProps}
        />
      ) : null}
    </div>
  );
}
