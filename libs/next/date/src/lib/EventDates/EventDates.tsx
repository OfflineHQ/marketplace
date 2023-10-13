// EventDates.tsx
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import React from 'react';
import {
  EventDatesClient,
  type EventDatesClientProps,
} from './EventDatesClient';

export type EventDatesProps = Omit<
  EventDatesClientProps,
  'fromText' | 'toText' | 'inYourTimezoneText' | 'fromHourText' | 'toHourText'
>;

export const EventDates: React.FC<EventDatesProps> = ({
  eventDateLocations,
  detailed,
}) => {
  const locale = useLocale();
  const t = useTranslations('Pass.UserPass.DateRange');
  return (
    <NextIntlClientProvider locale={locale} messages={undefined}>
      <EventDatesClient
        eventDateLocations={eventDateLocations}
        detailed={detailed}
        fromText={t('from')}
        toText={t('to')}
        fromHourText={t('from-hour')}
        toHourText={t('to-hour')}
        inYourTimezoneText={t('in-your-timezone')}
      />
    </NextIntlClientProvider>
  );
};
