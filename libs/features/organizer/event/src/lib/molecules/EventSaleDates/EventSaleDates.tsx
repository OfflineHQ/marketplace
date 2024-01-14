import { defaultLocale, messages, type Locale } from '@next/i18n';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import {
  EventSaleDatesClient,
  EventSaleDatesClientProps,
} from './EventSaleDatesClient';

export type EventSaleDatesProps = EventSaleDatesClientProps;

export const EventSaleDates: React.FC<EventSaleDatesProps> = (props) => {
  const _locale = useLocale();
  const locale: Locale = (_locale as Locale) || defaultLocale;
  const localeMessages = deepPick(messages[locale], [
    'Organizer.Event.EventSaleDates',
  ]);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      <EventSaleDatesClient {...props} />
    </NextIntlClientProvider>
  );
};
