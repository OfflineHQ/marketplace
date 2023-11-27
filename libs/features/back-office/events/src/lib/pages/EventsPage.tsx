import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import {
  EventsTable,
  type EventsTableProps,
} from '../organisms/EventsTable/EventsTable';
import { AppContainer, AppContainerHeader } from '@features/app-nav';
import { CardTitle, TableSkeleton } from '@ui/components';

export type EventsPageProps = EventsTableProps;

export function EventsPage(props: EventsPageProps) {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], ['OrganizerEvents.Table']);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <EventsTable {...props} />
    </NextIntlClientProvider>
  );
}

export function EventTableSkeleton() {
  const t = useTranslations('OrganizerEvents.Table');
  return (
    <AppContainer>
      <AppContainerHeader>
        <CardTitle>{t('title')}</CardTitle>
      </AppContainerHeader>
      <TableSkeleton rows={10} cols={3} />
    </AppContainer>
  );
}
