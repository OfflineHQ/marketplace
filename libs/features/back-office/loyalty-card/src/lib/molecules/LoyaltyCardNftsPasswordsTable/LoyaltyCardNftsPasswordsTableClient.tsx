'use client';

import { LoyaltyCardNftContract } from '@gql/shared/types';
import { NftMintPasswordOrganizer } from '@nft/types';
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
  Text,
} from '@ui/components';
import { Copy, Delete, Download, SeeDetails } from '@ui/icons';
import { cn } from '@ui/shared';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { AddMoreNftsPasswordsDrawer } from '../AddMoreNftsPasswordsDrawer/AddMoreNftsPasswordsDrawer';

export interface LoyaltyCardNftsPasswordsTableClientProps
  extends Omit<DataTableProps<NftMintPasswordOrganizer, unknown>, 'columns'>,
    Pick<
      LoyaltyCardNftContract,
      'contractAddress' | 'chainId' | 'loyaltyCardId'
    > {
  headerControlText: DataTableColumnHeaderProps<any, any>['controlText'];
}

type MenuActionTable = DataTableToolbarProps<
  NftMintPasswordOrganizer,
  unknown
>['menuActions'];

export function LoyaltyCardNftsPasswordsTableClient({
  headerControlText,
  className,
  contractAddress,
  chainId,
  loyaltyCardId,
  data,
  ...props
}: LoyaltyCardNftsPasswordsTableClientProps) {
  const t = useTranslations(
    'OrganizerLoyaltyCard.Card.LoyaltyCardNftsPasswordsTable',
  );
  const columns: ColumnDef<NftMintPasswordOrganizer>[] = [
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
      accessorKey: 'password',
      meta: {
        title: t('header-password'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          controlText={headerControlText}
          column={column}
          title={t('header-password')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue('password')}
            </span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: 'minterAddress',
      meta: {
        title: t('header-minter-address'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          controlText={headerControlText}
          column={column}
          title={t('header-minter-address')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue('minterAddress')}
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
            text: t('header-copy'),
            icon: <Copy />,
            //TODO action to download the file
            className: 'cursor-pointer',
          },
        ];
        if (!row.original.minterAddress) {
          items.splice(2, 0, {
            type: 'item',
            text: t('header-delete'),
            icon: <Delete />,
            // Add your delete function here
            action: () => null,
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
    // if (!eventPass.eventPassNftContract) {
    //   items.splice(2, 0, {
    //     type: 'item',
    //     className: 'cursor-pointer',
    //     icon: <Delete />,
    //     action: () =>
    //       deleteEventPassFiles({
    //         organizerId,
    //         eventId,
    //         eventPassId,
    //         filesSelected: rowSelection,
    //       }),
    //     text: t('menu-actions-delete', { numFilesSelected }),
    //   });
    // }
    return { items, helperText: t('menu-actions-helper-text') };
  }, [rowSelection, t, loyaltyCardId]);
  return (
    <DataTable<NftMintPasswordOrganizer, unknown>
      data={data}
      className={cn('size-full', className)}
      columns={columns}
      selectKey="password"
      onRowSelectionChange={setRowSelection}
      toolbarProps={{
        menuActions,
        toolbarChildren: data?.length > 0 && (
          <AddMoreNftsPasswordsDrawer
            contractAddress={contractAddress}
            chainId={chainId}
            loyaltyCardId={loyaltyCardId}
            triggerText={t('add-more-passwords')}
          />
        ),
        searchProps: {
          filterKey: 'password',
          placeholder: t('search-placeholder'),
        },
      }}
      initialRowSelection={initialRowSelection}
      {...props}
    >
      {data?.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center space-y-4">
          <Text>{t('no-results-add-more-passwords')}</Text>
          <AddMoreNftsPasswordsDrawer
            contractAddress={contractAddress}
            chainId={chainId}
            loyaltyCardId={loyaltyCardId}
            triggerText={t('add-passwords')}
          />
        </div>
      )}
    </DataTable>
  );
}
