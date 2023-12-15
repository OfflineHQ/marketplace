'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
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
import {
  DataTablePagination,
  type DataTablePaginationProps,
} from './DataTablePagination';
import {
  DataTableToolbar,
  type DataTableToolbarProps,
} from './DataTableToolbar';

export interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showHeader?: boolean;
  selectKey?: string;
  initialRowSelection?: RowSelectionState; // replace 'any' with the correct type
  initialColumnFilters?: ColumnFiltersState;
  initialSorting?: SortingState;
  onRowSelectionChange?: (selection: RowSelectionState) => void; // replace 'any' with the correct type
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  toolbarProps?: Omit<DataTableToolbarProps<TData, TValue>, 'table'>;
  paginationProps?: Omit<DataTablePaginationProps<TData>, 'table'>;
  noResultsText: string;
  children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  className,
  columns,
  data,
  selectKey,
  showHeader = true,
  toolbarProps,
  paginationProps,
  noResultsText,
  initialRowSelection,
  initialColumnFilters,
  initialSorting,
  onRowSelectionChange,
  onColumnFiltersChange,
  onSortingChange,
  children,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialRowSelection || {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialColumnFilters || [],
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    initialSorting || [],
  );

  React.useEffect(() => {
    onRowSelectionChange && onRowSelectionChange(rowSelection);
  }, [rowSelection, onRowSelectionChange]);

  React.useEffect(() => {
    onColumnFiltersChange && onColumnFiltersChange(columnFilters);
  }, [columnFilters, onColumnFiltersChange]);

  React.useEffect(() => {
    onSortingChange && onSortingChange(sorting);
  }, [sorting, onSortingChange]);

  // here we determine from the columns if we need to show the selection column in the table along as the pagination
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
    ...(selectKey
      ? {
          getRowId: (originalRow: TData, index: number, parent?: Row<TData>) =>
            selectKey
              ? (originalRow[selectKey as keyof TData] as string)
              : index.toString(),
        }
      : {}),
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

  // here if data change mean that we need to get the new rowSelection from the new table state
  React.useEffect(() => {
    const rowSelectedFiltered = Object.keys(
      table.getFilteredSelectedRowModel().rowsById,
    ).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setRowSelection(rowSelectedFiltered);
  }, [data, table]);

  return (
    <div className={cn('space-y-4 w-full', className)}>
      {toolbarProps && data.length ? (
        <DataTableToolbar table={table} {...toolbarProps} />
      ) : null}
      <div
        className={cn(
          'flex-grow h-full w-full overflow-auto rounded-md border',
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
                  {children || noResultsText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginationProps && data.length ? (
        <DataTablePagination
          table={table}
          enableRowSelection={hasSelectionColumn}
          {...paginationProps}
        />
      ) : null}
    </div>
  );
}
