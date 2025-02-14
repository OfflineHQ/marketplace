'use client';

import {
  EventFromOrganizerWithPasses,
  EventPassFileWithName,
} from '@features/back-office/events-types';
import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
import { useEffect, useMemo, useState } from 'react';
import { checkEventPassNftFilesHash } from '../../actions/checkEventPassFilesHash';
import { deleteEventPassFile } from '../../actions/deleteEventPassFile';
import { deleteEventPassFiles } from '../../actions/deleteEventPassFiles';
import { DuplicatesType } from '../../actions/types';
import { EventPassFilesUploader } from '../EventPassFilesUploader/EventPassFilesUploader';

export interface EventPassNftFilesTableClientProps
  extends Omit<DataTableProps<EventPassFileWithName, unknown>, 'columns'>,
    GetEventPassOrganizerFolderPath {
  headerControlText: DataTableColumnHeaderProps<any, any>['controlText'];
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
  eventSlug: string;
}

type MenuActionTable = DataTableToolbarProps<
  EventPassFileWithName,
  unknown
>['menuActions'];

export function EventPassNftFilesTableClient({
  headerControlText,
  className,
  eventPass,
  organizerId,
  eventId,
  eventPassId,
  eventSlug,
  data,
  ...props
}: EventPassNftFilesTableClientProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassNftFilesTable',
  );
  const locale = useLocale();

  const formatDuplicates = (duplicates: DuplicatesType) => {
    return duplicates.map((group, index) => (
      <ul key={index}>
        {group.map((filePath) => (
          <li key={filePath}>{filePath.split('/').pop()}</li>
        ))}
      </ul>
    ));
  };
  const [duplicates, setDuplicates] = useState<DuplicatesType>([]);
  const columns: ColumnDef<EventPassFileWithName>[] = [
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
        ];
        if (!eventPass.eventPassNftContract) {
          items.splice(2, 0, {
            type: 'item',
            text: t('header-delete'),
            icon: <Delete />,
            // Add your delete function here
            action: () =>
              deleteEventPassFile({
                filePath: row.original.filePath,
                organizerId,
                eventId,
                eventPassId,
              }),
            className: 'cursor-pointer',
          });
        }
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
    ];
    if (!eventPass.eventPassNftContract) {
      items.splice(2, 0, {
        type: 'item',
        className: 'cursor-pointer',
        icon: <Delete />,
        action: () =>
          deleteEventPassFiles({
            organizerId,
            eventId,
            eventPassId,
            filesSelected: rowSelection,
          }),
        text: t('menu-actions-delete', { numFilesSelected }),
      });
    }
    return { items, helperText: t('menu-actions-helper-text') };
  }, [
    organizerId,
    eventId,
    eventPassId,
    rowSelection,
    t,
    eventPass.eventPassNftContract,
  ]);

  useEffect(() => {
    async function fetchDuplicates() {
      if (data) {
        const duplicates = await checkEventPassNftFilesHash({
          filesPath: data.map((file) => file.filePath),
          organizerId,
          eventId,
          eventPassId,
        });
        if (duplicates.length > 0) {
          setDuplicates(duplicates);
          const newSelection: RowSelectionState = {};
          duplicates.forEach((group) => {
            group.forEach((filePath: string, index: number) => {
              const file = data.find((item) => item.filePath === filePath);
              if (file && index) {
                newSelection[file.fileName] = true;
              }
            });
          });
          setInitialRowSelection(newSelection);
        } else {
          setDuplicates([]);
        }
      }
    }

    fetchDuplicates();
  }, [data, organizerId, eventId, eventPassId]);

  if (data.length === 0) return null;

  return (
    <div className="space-y-4">
      {duplicates.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>
            {t.rich('duplicates-alert', {
              count: duplicates.length,
              br: () => <br />,
            })}
          </AlertTitle>
          <AlertDescription className="flex-col space-y-2">
            {formatDuplicates(duplicates).map((group) => group)}
          </AlertDescription>
        </Alert>
      )}
      <DataTable<EventPassFileWithName, unknown>
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
        {!eventPass.eventPassNftContract && (
          <EventPassFilesUploader
            eventPass={eventPass}
            organizerId={organizerId}
            eventId={eventId}
            eventPassId={eventPassId}
            eventSlug={eventSlug}
          />
        )}
      </DataTable>
    </div>
  );
}
