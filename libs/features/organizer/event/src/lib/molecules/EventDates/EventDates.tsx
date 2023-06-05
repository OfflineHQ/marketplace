// EventDates.tsx
import React from 'react';
import { deepPick } from '@utils';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import {
  EventDatesClient,
  type EventDatesClientProps,
} from './EventDatesClient';

export type EventDatesProps = Exclude<
  EventDatesClientProps,
  'fromText' | 'toText'
>;

export const EventDates: React.FC<EventDatesClientProps> = ({
  eventDateLocations,
  detailed,
}) => {
  const locale = useLocale();
  const t = useTranslations('Organizer.EventDates');
  return (
    <NextIntlClientProvider locale={locale} messages={undefined}>
      <EventDatesClient
        eventDateLocations={eventDateLocations}
        detailed={detailed}
        fromText={t('from')}
        toText={t('to')}
      />
    </NextIntlClientProvider>
  );
};
