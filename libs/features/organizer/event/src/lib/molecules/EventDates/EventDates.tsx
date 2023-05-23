// EventDates.tsx
import { pick } from 'remeda';
import React from 'react';
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
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pick(messages[(locale as Locale) || defaultLocale], ['Header'])}
    >
      <EventDatesClient
        eventDateLocations={eventDateLocations}
        detailed={detailed}
      />
    </NextIntlClientProvider>
  );
};
