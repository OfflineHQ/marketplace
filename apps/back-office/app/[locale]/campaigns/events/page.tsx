import { EventTableSkeleton, EventsPage } from '@features/back-office/events';
import { getEventsFromOrganizerIdTable } from '@features/back-office/events-api';
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

interface EventsProps {
  params: {
    locale: Locale;
  };
}

async function EventsContent({ params: { locale } }: EventsProps) {
  const user = await getCurrentUser();
  if (!user) return;
  const organizerId = user.role?.organizerId || '';
  if (!organizerId) return;
  const events = await getEventsFromOrganizerIdTable({
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
    namespace: 'OrganizerEvents.Table',
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
    <EventsPage
      events={events || []}
      toolbarProps={toolbarProps}
      noResultsText={noResultsText}
      paginationProps={paginationProps}
      headerControlText={headerControlText}
    />
  );
}

export default function Events(props: EventsProps) {
  return (
    <Suspense fallback={<EventTableSkeleton />}>
      <EventsContent {...props} />
    </Suspense>
  );
}
