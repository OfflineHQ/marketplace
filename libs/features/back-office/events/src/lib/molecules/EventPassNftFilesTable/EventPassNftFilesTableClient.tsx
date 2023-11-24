'use client';

import { FileSummary } from '@bytescale/sdk';
import { ColumnDef } from '@tanstack/react-table';
import {
  Checkbox,
  DataTable,
  DataTableColumnHeader,
  DataTableProps,
  DataTableRowActions,
  DataTableRowActionsProps,
} from '@ui/components';
import { Delete, SeeDetails } from '@ui/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ColumnsProps } from '../../organisms/EventsTable/EventsTable';

export interface EventPassNftFilesTableClientProps
  extends Pick<ColumnsProps, 'headerControlText'>,
    Omit<DataTableProps<FileSummary, unknown>, 'columns'> {}

export function EventPassNftFilesTableClient({
  headerControlText,
  ...props
}: EventPassNftFilesTableClientProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftFilesTable',
  );
  const columns: ColumnDef<FileSummary>[] = [
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
      accessorKey: 'filePath',
      meta: {
        title: t('header-file-path'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          controlText={headerControlText}
          column={column}
          title={t('header-file-path')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue('filePath')}
            </span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      id: 'actions',
      meta: {
        align: 'right',
      },
      cell: ({ row }) => {
        const items = [
          {
            type: 'item',
            text: t('header-show'),
            icon: <SeeDetails />,
            wrapper: <Link href={`/nftFiles/${row.getValue('filePath')}`} />,
            className: 'cursor-pointer',
          },
          {
            type: 'item',
            text: t('header-delete'),
            icon: <Delete />,
            // Add your delete function here
            action: () => null,
            className: 'cursor-pointer',
          },
        ] satisfies DataTableRowActionsProps['items'];
        return <DataTableRowActions items={items} />;
      },
    },
  ];

  return (
    <DataTable<FileSummary, unknown>
      className="h-full w-full"
      {...props}
      columns={columns}
    />
  );
}
