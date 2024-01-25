'use client';

import { AppContainer, AppContainerHeader } from '@features/app-nav';
import type { ContentSpaceFromOrganizerTable } from '@features/back-office/content-spaces-types';
import { Link } from '@next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  CardTitle,
  DataTable,
  DataTableColumnHeader,
  DataTableColumnHeaderProps,
  DataTableProps,
  DataTableRowActions,
  DataTableRowActionsProps,
} from '@ui/components';
import { Edit } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { ContentSpaceStatusBadge } from '../../molecules/ContentSpaceStatusBadge/ContentSpaceStatusBadge';

export interface ColumnsProps {
  titleText: string;
  slugText: string;
  dateStartText: string;
  editText: string;
  headerControlText: DataTableColumnHeaderProps<any, any>['controlText'];
}

export interface ContentSpacesTableProps
  extends Pick<ColumnsProps, 'headerControlText'>,
    Omit<
      DataTableProps<ContentSpaceFromOrganizerTable, unknown>,
      'columns' | 'data'
    > {
  contentSpaces: ContentSpaceFromOrganizerTable[];
}

export function ContentSpacesTable({
  contentSpaces,
  headerControlText,
  ...props
}: ContentSpacesTableProps) {
  // const tTable = useTranslations('UI.Table');
  const t = useTranslations('OrganizerContentSpaces.Table');
  const columns: ColumnDef<ContentSpaceFromOrganizerTable>[] = [
    {
      accessorKey: 'title',
      meta: {
        title: t('header-title'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('header-title')}
          controlText={headerControlText}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue('title')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'slug',
      meta: {
        title: t('header-slug'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('header-slug')}
          controlText={headerControlText}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[100px] items-center">
            <span>{row.getValue('slug')}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'contentSpaceParameters.status',
      meta: {
        title: t('header-status'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('header-status')}
          controlText={headerControlText}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.contentSpaceParameters?.status;
        return (
          <div className="flex items-center">
            <ContentSpaceStatusBadge status={status} />
          </div>
        );
      },
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
            text: t('header-edit'),
            icon: <Edit />,
            wrapper: (
              <Link href={`/perks/content-spaces/${row.getValue('slug')}`} />
            ),
            className: 'cursor-pointer',
          },
        ] satisfies DataTableRowActionsProps['items'];
        return <DataTableRowActions items={items} />;
      },
    },
  ];
  return (
    <AppContainer>
      <AppContainerHeader>
        <CardTitle>{t('title')}</CardTitle>
      </AppContainerHeader>
      <DataTable<ContentSpaceFromOrganizerTable, unknown>
        className="size-full px-6 pb-60 md:pb-60"
        data={contentSpaces}
        columns={columns}
        {...props}
      />
      {/* noResultsText={tTable('no-results')} */}
    </AppContainer>
  );
}
