import { AppNavLayout } from '@features/back-office/app-nav';
import { WithSuperAdminRole } from '@features/back-office/app-nav/stories';
import { EventFromOrganizerTable } from '@features/back-office/events-types';
import { EventStatus_Enum } from '@gql/shared/types';
import {
  useTableHeaderControlText,
  useTableNoResultText,
  useTablePaginationControlText,
  useTableToggleColumnsControlText,
} from '@next/i18n-ui';
import { useTranslations } from 'next-intl';
import { EventsTable, EventsTableProps } from './EventsTable';

export const eventsTableData: EventFromOrganizerTable[] = [
  {
    title: 'An event test title',
    slug: 'test-an-event-test-title',
    eventParameters: {
      dateStart: '2023-08-24 08:35:47.155813',
      dateEnd: '2023-08-25 12:00:00.155813',
      dateSaleStart: '2023-07-23 12:00:00.0',
      dateSaleEnd: '2023-08-24 12:00:00.0',
      timezone: 'Europe/London',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Another event title',
    slug: 'test-another-event-title',
  },
  {
    title: 'Upcoming concert',
    slug: 'upcoming-concert',
    eventParameters: {
      dateStart: '2023-10-20 19:00:00.0',
      dateEnd: '2023-10-21 23:00:00.0',
      dateSaleStart: '2023-09-25 12:00:00.0',
      dateSaleEnd: '2023-10-19 12:00:00.0',
      timezone: 'America/New_York',
      status: EventStatus_Enum.Published,
    },
  },
  {
    title: 'Summer Festival',
    slug: 'summer-festival',
    eventParameters: {
      dateStart: '2023-06-30 14:00:00.0',
      dateEnd: '2023-07-02 23:59:59.0',
      dateSaleStart: '2023-05-15 12:00:00.0',
      dateSaleEnd: '2023-06-29 12:00:00.0',
      timezone: 'Europe/Berlin',
      status: EventStatus_Enum.Published,
    },
  },
  {
    title: 'Tech Conference',
    slug: 'tech-conference',
    eventParameters: {
      dateStart: '2023-11-10 09:00:00.0',
      dateEnd: '2023-11-12 18:00:00.0',
      dateSaleStart: '2023-10-01 12:00:00.0',
      dateSaleEnd: '2023-11-09 12:00:00.0',
      timezone: 'America/Los_Angeles',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Music Showcase',
    slug: 'music-showcase',
    eventParameters: {
      dateStart: '2023-09-05 19:30:00.0',
      dateEnd: '2023-09-06 23:30:00.0',
      dateSaleStart: '2023-08-01 12:00:00.0',
      dateSaleEnd: '2023-09-04 12:00:00.0',
      timezone: 'America/New_York',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Art Exhibition',
    slug: 'art-exhibition',
    eventParameters: {
      dateStart: '2023-07-15 10:00:00.0',
      dateEnd: '2023-07-17 18:00:00.0',
      dateSaleStart: '2023-06-01 12:00:00.0',
      dateSaleEnd: '2023-07-14 12:00:00.0',
      timezone: 'Europe/Paris',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Sports Championship',
    slug: 'sports-championship',
    eventParameters: {
      dateStart: '2023-12-01 14:00:00.0',
      dateEnd: '2023-12-03 21:00:00.0',
      dateSaleStart: '2023-11-01 12:00:00.0',
      dateSaleEnd: '2023-11-30 12:00:00.0',
      timezone: 'Europe/London',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Summer Music Festival in Central Park',
    slug: 'summer-music-festival-central-park',
    eventParameters: {
      dateStart: '2024-07-01 15:00:00.0',
      dateEnd: '2024-07-03 23:59:59.0',
      dateSaleStart: '2024-05-01 12:00:00.0',
      dateSaleEnd: '2024-06-30 12:00:00.0',
      timezone: 'America/New_York',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'International Art Exhibition: A Journey Through Time and Space',
    slug: 'international-art-exhibition-journey',
    eventParameters: {
      dateStart: '2024-09-10 10:00:00.0',
      dateEnd: '2024-09-15 18:00:00.0',
      dateSaleStart: '2024-07-01 12:00:00.0',
      dateSaleEnd: '2024-09-09 12:00:00.0',
      timezone: 'Europe/Paris',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Epic Sci-Fi Convention: GalaxyQuest 2024',
    slug: 'epic-sci-fi-convention-galaxyquest',
    eventParameters: {
      dateStart: '2025-03-15 09:00:00.0',
      dateEnd: '2025-03-18 20:00:00.0',
      dateSaleStart: '2024-12-01 12:00:00.0',
      dateSaleEnd: '2025-03-14 12:00:00.0',
      timezone: 'America/Los_Angeles',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'World Series of Poker Championship',
    slug: 'world-series-poker-championship',
    eventParameters: {
      dateStart: '2025-11-20 12:00:00.0',
      dateEnd: '2025-11-30 23:59:59.0',
      dateSaleStart: '2025-09-01 12:00:00.0',
      dateSaleEnd: '2025-11-19 12:00:00.0',
      timezone: 'Europe/London',
      status: EventStatus_Enum.Draft,
    },
  },
  {
    title: 'Historical Reenactment: Battle of Gettysburg 160th Anniversary',
    slug: 'historical-reenactment-battle-gettysburg',
    eventParameters: {
      dateStart: '2023-07-01 08:00:00.0',
      dateEnd: '2023-07-03 18:00:00.0',
      dateSaleStart: '2023-05-01 12:00:00.0',
      dateSaleEnd: '2023-06-30 12:00:00.0',
      timezone: 'America/New_York',
      status: EventStatus_Enum.Draft,
    },
  },
];

export function EventsTableExample(props: EventsTableProps) {
  const headerControlText = useTableHeaderControlText();
  const noResultsText = useTableNoResultText();
  const paginationProps = {
    controlText: useTablePaginationControlText(),
  };
  const t = useTranslations('OrganizerEvents.Table');
  const toolbarProps = {
    searchProps: {
      filterKey: 'title',
      placeholder: t('search-placeholder'),
    },
    toggleColumnsText: useTableToggleColumnsControlText(),
  };
  return (
    <AppNavLayout {...WithSuperAdminRole.args}>
      <EventsTable
        {...props}
        headerControlText={headerControlText}
        noResultsText={noResultsText}
        toolbarProps={toolbarProps}
        paginationProps={paginationProps}
      />
    </AppNavLayout>
  );
}
