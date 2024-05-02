import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import { ContentSpaceFromOrganizerTable } from '@features/back-office/content-spaces-types';
import { ContentSpaceStatus_Enum } from '@gql/shared/types';
import {
  useTableHeaderControlText,
  useTableNoResultText,
  useTablePaginationControlText,
  useTableToggleColumnsControlText,
} from '@next/i18n-ui';
import { useTranslations } from 'next-intl';
import {
  ContentSpacesTable,
  ContentSpacesTableProps,
} from './ContentSpacesTable';

export const contentSpacesTableData: ContentSpaceFromOrganizerTable[] = [
  {
    title: 'Content test title',
    slug: 'content-test-title',
    contentSpaceParameters: {
      status: ContentSpaceStatus_Enum.Draft,
    },
  },
  {
    title: 'Another content title',
    slug: 'another-content-title',
  },
  {
    title: 'Upcoming concert',
    slug: 'upcoming-concert',
    contentSpaceParameters: {
      status: ContentSpaceStatus_Enum.Published,
    },
  },
  {
    title: 'Summer Festival',
    slug: 'summer-festival',
    contentSpaceParameters: {
      status: ContentSpaceStatus_Enum.Published,
    },
  },
  {
    title: 'Tech Conference',
    slug: 'tech-conference',
    contentSpaceParameters: {
      status: ContentSpaceStatus_Enum.Draft,
    },
  },
  {
    title: 'Music Showcase',
    slug: 'music-showcase',
    contentSpaceParameters: {
      status: ContentSpaceStatus_Enum.Draft,
    },
  },
  {
    title: 'Historical Reenactment: Battle of Gettysburg 160th Anniversary',
    slug: 'historical-reenactment-battle-gettysburg',
    contentSpaceParameters: {
      status: ContentSpaceStatus_Enum.Draft,
    },
  },
];

export function ContentSpacesTableExample(props: ContentSpacesTableProps) {
  const headerControlText = useTableHeaderControlText();
  const noResultsText = useTableNoResultText();
  const paginationProps = {
    controlText: useTablePaginationControlText(),
  };
  const t = useTranslations('OrganizerContentSpaces.Table');
  const toolbarProps = {
    searchProps: {
      filterKey: 'title',
      placeholder: t('search-placeholder'),
    },
    toggleColumnsText: useTableToggleColumnsControlText(),
  };
  return (
    <AppNavLayout {...WithSuperAdminRole.args}>
      <ContentSpacesTable
        {...props}
        headerControlText={headerControlText}
        noResultsText={noResultsText}
        toolbarProps={toolbarProps}
        paginationProps={paginationProps}
      />
    </AppNavLayout>
  );
}
