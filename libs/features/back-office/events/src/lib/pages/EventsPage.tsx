import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  EventsTable,
  type EventsTableProps,
} from '../organisms/EventsTable/EventsTable';

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
