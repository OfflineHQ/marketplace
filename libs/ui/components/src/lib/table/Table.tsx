import * as React from 'react';

import { cn } from '@ui/shared';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-accent/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-accent/50 data-[state=selected]:bg-accent',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-accent-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-accent-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

interface ColsSkeletonProps {
  cols: number;
}

const CellSkeleton = () => (
  <TableCell>
    <div className="h-4 w-32 rounded bg-skeleton" />
  </TableCell>
);

const HeaderSkeleton = () => (
  <TableHead>
    <div className={cn('h-4 w-16 rounded bg-skeleton')} />
  </TableHead>
);

const FooterSkeleton = () => (
  <TableCell>
    <div className={cn('h-4 w-16 rounded bg-skeleton')} />
  </TableCell>
);

const SkeletonRow: React.FC<ColsSkeletonProps> = ({ cols }) => (
  <TableRow className="animate-pulse">
    {Array.from({ length: cols }, (_, i) => (
      <CellSkeleton key={i} />
    ))}
  </TableRow>
);

const HeaderRowSkeleton: React.FC<ColsSkeletonProps> = ({ cols }) => (
  <TableHeader className="animate-pulse">
    <TableRow>
      {Array.from({ length: cols }, (_, i) => (
        <HeaderSkeleton key={i} />
      ))}
    </TableRow>
  </TableHeader>
);

interface TableSkeletonProps extends ColsSkeletonProps {
  rows: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows, cols }) => (
  <Table>
    <HeaderRowSkeleton cols={cols} />
    <TableBody>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </TableBody>
    <TableFooter>{/* <FooterRowSkeleton cols={cols} /> */}</TableFooter>
  </Table>
);

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
};
