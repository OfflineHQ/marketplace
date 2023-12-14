'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Column, Table } from '@tanstack/react-table';
import { OutlineSearch } from '@ui/icons';
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

interface SearchProps<TData, TValue> {
  placeholder?: string;
  filterKey: string;
}

export interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  searchProps?: SearchProps<TData, TValue>;
  filtersConfig?: Omit<FilterConfig<TData, TValue>, 'controlText'>[];
  filtersConfigText?: DataTableFacetedFilterProps<
    TData,
    TValue
  >['controlText'] & {
    reset: string;
  };
  toggleColumnsText?: DataTableViewOptionsProps<TData>['controlText'];
}

export function DataTableToolbar<TData, TValue>({
  table,
  searchProps,
  filtersConfig = [],
  filtersConfigText,
  toggleColumnsText,
}: DataTableToolbarProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchProps && (
          <Input
            placeholder={searchProps.placeholder}
            icon={<OutlineSearch />}
            value={
              (table
                .getColumn(searchProps.filterKey)
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn(searchProps.filterKey)
                ?.setFilterValue(event.target.value)
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
      {toggleColumnsText && (
        <DataTableViewOptions table={table} controlText={toggleColumnsText} />
      )}
    </div>
  );
}
