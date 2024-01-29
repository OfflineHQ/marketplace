'use client';

import { ContentSpaceFileWithName } from '@features/back-office/content-spaces-types';
import { GetContentSpaceFolderPath } from '@features/content-space-common';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  Checkbox,
  DataTable,
  DataTableColumnHeader,
  DataTableColumnHeaderProps,
  DataTableProps,
  DataTableRowActions,
  DataTableRowActionsProps,
  DataTableToolbarProps,
  DropdownMenuActionsProps,
} from '@ui/components';
import { Delete, Download, SeeDetails } from '@ui/icons';
import { cn } from '@ui/shared';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { deleteContentSpaceFile } from '../../actions/deleteContentSpaceFile';
import { deleteContentSpaceFiles } from '../../actions/deleteContentSpaceFiles';
import { ContentSpaceFilesUploader } from '../ContentSpaceFilesUploader/ContentSpaceFilesUploader';

export interface ContentSpaceFilesTableClientProps
  extends Omit<DataTableProps<ContentSpaceFileWithName, unknown>, 'columns'>,
    GetContentSpaceFolderPath {
  headerControlText: DataTableColumnHeaderProps<any, any>['controlText'];
}

type MenuActionTable = DataTableToolbarProps<
  ContentSpaceFileWithName,
  unknown
>['menuActions'];

export function ContentSpaceFilesTableClient({
  headerControlText,
  className,
  contentSpaceId,
  organizerId,
  data,
  ...props
}: ContentSpaceFilesTableClientProps) {
  const t = useTranslations(
    'OrganizerContentSpaces.Sheet.ContentSpaceFilesTable',
  );
  const locale = useLocale();
  const columns: ColumnDef<ContentSpaceFileWithName>[] = [
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
      accessorKey: 'fileName',
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
              {row.getValue('fileName')}
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
        const items: DataTableRowActionsProps['items'] = [
          {
            type: 'item',
            text: t('header-show'),
            icon: <SeeDetails />,
            //TODO action to show file in a new window
            className: 'cursor-pointer',
          },
          {
            type: 'item',
            text: t('header-download'),
            icon: <Download />,
            //TODO action to download the file
            className: 'cursor-pointer',
          },
          {
            type: 'item',
            text: t('header-delete'),
            icon: <Delete />,
            // Add your delete function here
            action: () =>
              deleteContentSpaceFile({
                filePath: row.original.filePath,
                organizerId,
                contentSpaceId,
              }),
            className: 'cursor-pointer',
          },
        ];
        return <DataTableRowActions items={items} />;
      },
    },
  ];

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [initialRowSelection, setInitialRowSelection] =
    useState<RowSelectionState>({});

  const menuActions: MenuActionTable = useMemo<MenuActionTable>(() => {
    const numFilesSelected = Object.keys(rowSelection).length || 0;
    const items: DropdownMenuActionsProps['items'] = [
      {
        type: 'label',
        text: t('menu-actions-label', { numFilesSelected }),
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        className: 'cursor-pointer',
        icon: <Download />,
        // todo add multi download function
        text: t('menu-actions-download', { numFilesSelected }),
      },
      {
        type: 'item',
        className: 'cursor-pointer',
        icon: <Delete />,
        action: () =>
          deleteContentSpaceFiles({
            organizerId,
            contentSpaceId,
            filesSelected: rowSelection,
          }),
        text: t('menu-actions-delete', { numFilesSelected }),
      },
    ];

    return { items, helperText: t('menu-actions-helper-text') };
  }, [organizerId, contentSpaceId, rowSelection, t]);

  return (
    <div className="space-y-4">
      <DataTable<ContentSpaceFileWithName, unknown>
        data={data}
        className={cn('size-full', className)}
        columns={columns}
        selectKey="fileName"
        onRowSelectionChange={setRowSelection}
        toolbarProps={{
          menuActions,
          searchProps: {
            filterKey: 'fileName',
            placeholder: t('search-placeholder'),
          },
        }}
        initialRowSelection={initialRowSelection}
        {...props}
      >
        <ContentSpaceFilesUploader
          organizerId={organizerId}
          contentSpaceId={contentSpaceId}
        />
      </DataTable>
    </div>
  );
}
