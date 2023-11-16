'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Column, Table } from '@tanstack/react-table';
import { Button } from '../button/Button';
import { Input } from '../input/Input';
import {
  DataTableFacetedFilter,
  DataTableFacetedFilterProps,
} from './DataTableFacetedFilter';
import {
  DataTableViewOptions,
  DataTableViewOptionsProps,
} from './DataTableViewOptions';

interface FilterConfig<TData, TValue>
  extends Omit<DataTableFacetedFilterProps<TData, TValue>, 'column'> {
  id: string; // ID of the column
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  enableSearch?: boolean;
  filtersConfig?: FilterConfig<TData, any>[];
  filtersConfigText?: DataTableFacetedFilterProps<TData, any>['controlText'] & {
    reset: string;
  };
  showToggleColumns?: boolean;
  toggleColumnsText?: DataTableViewOptionsProps<TData>['controlText'];
}

export function DataTableToolbar<TData>({
  table,
  enableSearch = false,
  filtersConfig = [],
  filtersConfigText,
  showToggleColumns = false,
  toggleColumnsText,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {enableSearch && (
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filtersConfig.map(({ id, title, options }) => {
          const column = table.getColumn(id) as Column<TData, any>; // Cast to the correct type
          return (
            column &&
            filtersConfigText && (
              <DataTableFacetedFilter
                key={id}
                column={column}
                title={title}
                options={options}
                controlText={filtersConfigText}
              />
            )
          );
        })}
        {isFiltered && filtersConfigText && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {filtersConfigText.reset}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {showToggleColumns && toggleColumnsText && (
        <DataTableViewOptions table={table} controlText={toggleColumnsText} />
      )}
    </div>
  );
}
