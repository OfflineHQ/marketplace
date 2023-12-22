import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

import { cn } from '@ui/shared';
import { Button } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  controlText: {
    asc: string;
    desc: string;
    hide: string;
  };
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  controlText,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.columnDef.enableSorting !== false && (
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              {controlText.asc}
            </DropdownMenuItem>
          )}
          {column.columnDef.enableSorting !== false && (
            <DropdownMenuSeparator />
          )}
          {column.columnDef.enableSorting !== false && (
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              {controlText.desc}
            </DropdownMenuItem>
          )}
          {column.columnDef.enableHiding !== false && <DropdownMenuSeparator />}
          {column.columnDef.enableHiding !== false && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              {controlText.hide}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
