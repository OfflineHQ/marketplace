// EventDates.tsx
import React from 'react';
import { deepPick } from '@utils';
import { useLocale, NextIntlClientProvider } from 'next-intl';
import {
  EventDatesClient,
  type EventDatesClientProps,
} from './EventDatesClient';
import { messages, defaultLocale, type Locale } from '@client/i18n';

export type EventDatesProps = EventDatesClientProps;

export const EventDates: React.FC<EventDatesClientProps> = ({
  eventDateLocations,
  detailed,
}) => {
  const locale = useLocale();
  const localesMessage = messages[(locale as Locale) || defaultLocale];
  const pickedMessages = deepPick(localesMessage, ['Organizer.EventDates']);
  return (
    <NextIntlClientProvider locale={locale} messages={pickedMessages}>
      <EventDatesClient
        eventDateLocations={eventDateLocations}
        detailed={detailed}
      />
    </NextIntlClientProvider>
  );
};
