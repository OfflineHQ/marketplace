'use client';

import React from 'react';
import type { EventDateLocation } from '../../types';
import { Calendar as CalendarIcon } from '@ui/icons';
import { Text } from '@ui/components';
import { useFormatter } from 'next-intl';

export interface EventDatesClientProps {
  eventDateLocations: EventDateLocation[];
  detailed?: boolean;
}

const style = {
  date: 'text-base font-semibold mx-2',
  hourMinutes: 'text-base font-semibold px-1',
};

export const EventDatesClient: React.FC<EventDatesClientProps> = ({
  eventDateLocations,
  detailed,
}) => {
  const format = useFormatter();

  if (!eventDateLocations.length) return null;

  const formatDateTime = (date: string, options: any) =>
    format.dateTime(new Date(date), options);

  const commonDate = eventDateLocations[0];

  return (
    <div className="flex items-center space-x-4">
      <CalendarIcon size="lg" flex />
      <div className="flex flex-col items-start space-y-4">
        {eventDateLocations.length > 1 && !detailed ? (
          <Text className={`ml-1 flex`}>
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
              {formatDateTime(
                eventDateLocations[eventDateLocations.length - 1].dateEnd,
                {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  hour: 'numeric',
                  minute: 'numeric',
                }
              )}
            </span>
          </Text>
        ) : (
          eventDateLocations.map((eventDate) => (
            <Text key={eventDate.id} className={`ml-1 flex`}>
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
