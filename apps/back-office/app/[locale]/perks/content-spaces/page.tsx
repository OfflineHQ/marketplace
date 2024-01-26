import {
  ContentSpaceTableSkeleton,
  ContentSpacesPage,
} from '@features/back-office/content-spaces';
import { getContentSpacesFromOrganizerIdTable } from '@features/back-office/content-spaces-api';
import { Locale } from '@gql/shared/types';
import {
  getTableHeaderControlText,
  getTableNoResultText,
  getTablePaginationControlText,
  getTableToggleColumnsControlText,
} from '@next/i18n-ui';
import { getCurrentUser } from '@next/next-auth/user';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

interface ContentSpacesProps {
  params: {
    locale: Locale;
  };
}

async function ContentSpacesContent({
  params: { locale },
}: ContentSpacesProps) {
  const user = await getCurrentUser();
  if (!user) return;
  const organizerId = user.role?.organizerId || '';
  if (!organizerId) return;
  const contentSpaces = await getContentSpacesFromOrganizerIdTable({
    id: organizerId as string,
    locale,
  });
  const headerControlText = await getTableHeaderControlText(locale);
  const noResultsText = await getTableNoResultText(locale);
  const paginationPropsText = await getTablePaginationControlText(locale);
  const paginationProps = {
    controlText: paginationPropsText,
  };
  const t = await getTranslations({
    locale,
    namespace: 'OrganizerContentSpaces.Table',
  });
  const toggleColumnsText = await getTableToggleColumnsControlText(locale);
  const toolbarProps = {
    searchProps: {
      filterKey: 'title',
      placeholder: t('search-placeholder'),
    },
    toggleColumnsText,
  };
  return (
    <ContentSpacesPage
      contentSpaces={contentSpaces || []}
      toolbarProps={toolbarProps}
      noResultsText={noResultsText}
      paginationProps={paginationProps}
      headerControlText={headerControlText}
    />
  );
}

export default function ContentSpaces(props: ContentSpacesProps) {
  return (
    <Suspense fallback={<ContentSpaceTableSkeleton />}>
      <ContentSpacesContent {...props} />
    </Suspense>
  );
}
