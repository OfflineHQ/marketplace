// EventDates.tsx

'use client';

import React from 'react';
import type { EventDateLocation } from '../../types';
import { Calendar as CalendarIcon } from '@ui/icons';
import { Text } from '@ui/components';
import { useFormatter } from 'next-intl';

export interface EventDatesProps {
  dates: EventDateLocation[];
  detailed?: boolean;
}

const style = {
  date: 'text-base font-semibold mx-2',
  hourMinutes: 'text-base font-semibold px-1',
};

export const EventDates: React.FC<EventDatesProps> = ({ dates, detailed }) => {
  const format = useFormatter();

  if (!dates.length) return null;

  const formatDateTime = (date: string, options: any) =>
    format.dateTime(new Date(date), options);

  const commonDate = dates[0];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex min-w-[1.75rem] items-center justify-center">
        {/* added a wrapper around the SVG */}
        <CalendarIcon size="lg" />
      </div>
      <div className="flex flex-col items-start space-y-4">
        {dates.length > 1 && !detailed ? (
          <Text className={`flex`}>
            From{' '}
            <span className={style.date}>
              {formatDateTime(commonDate.dateStart, {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                hour: 'numeric',
                minute: 'numeric',
              })}{' '}
            </span>
            To{' '}
            <span className={style.date}>
              {formatDateTime(dates[dates.length - 1].dateEnd, {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          </Text>
        ) : (
          dates.map((eventDate) => (
            <Text key={eventDate.id} className={`flex`}>
              <span className={style.date}>
                {formatDateTime(eventDate.dateStart, {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
              </span>
              from{' '}
              <span className={style.hourMinutes}>
                {formatDateTime(eventDate.dateStart, {
                  hour: 'numeric',
                  minute: 'numeric',
                })}{' '}
              </span>
              to{' '}
              <span className={style.hourMinutes}>
                {formatDateTime(eventDate.dateEnd, {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </span>
            </Text>
          ))
        )}
      </div>
    </div>
  );
};
