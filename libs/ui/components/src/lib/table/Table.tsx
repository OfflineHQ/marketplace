import * as React from 'react';

import { cn } from '@ui/shared';

import { VariantProps, cva } from 'class-variance-authority';

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
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
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
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
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
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
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
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

const tableSkeletonVariantsCva = cva('', {
  variants: {
    variant: {
      default: 'bg-muted',
      highlight: 'bg-highlight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ColsSkeletonProps
  extends VariantProps<typeof tableSkeletonVariantsCva> {
  cols: number;
}

const CellSkeleton = ({
  variant,
}: VariantProps<typeof tableSkeletonVariantsCva>) => (
  <TableCell>
    <div
      className={cn(tableSkeletonVariantsCva({ variant }), 'h-4 w-32 rounded')}
    />
  </TableCell>
);

const HeaderSkeleton = ({
  variant,
}: VariantProps<typeof tableSkeletonVariantsCva>) => (
  <TableHead>
    <div
      className={cn(tableSkeletonVariantsCva({ variant }), 'h-4 w-16 rounded')}
    />
  </TableHead>
);

const FooterSkeleton = ({
  variant,
}: VariantProps<typeof tableSkeletonVariantsCva>) => (
  <TableCell>
    <div
      className={cn(tableSkeletonVariantsCva({ variant }), 'h-4 w-16 rounded')}
    />
  </TableCell>
);

const SkeletonRow: React.FC<ColsSkeletonProps> = ({ cols, variant }) => (
  <TableRow className="animate-pulse">
    {Array.from({ length: cols }, (_, i) => (
      <CellSkeleton variant={variant} key={i} />
    ))}
  </TableRow>
);

const HeaderRowSkeleton: React.FC<ColsSkeletonProps> = ({ cols, variant }) => (
  <TableHeader className="animate-pulse">
    <TableRow>
      {Array.from({ length: cols }, (_, i) => (
        <HeaderSkeleton variant={variant} key={i} />
      ))}
    </TableRow>
  </TableHeader>
);

interface TableSkeletonProps extends ColsSkeletonProps {
  rows: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows,
  cols,
  variant,
}) => (
  <Table>
    <HeaderRowSkeleton cols={cols} variant={variant} />
    <TableBody>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} cols={cols} variant={variant} />
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
