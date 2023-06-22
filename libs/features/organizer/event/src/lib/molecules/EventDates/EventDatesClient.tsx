// EventDatesClient.tsx

'use client';

import React from 'react';
import type { EventDateLocation } from '../../types';
import { Calendar as CalendarIcon } from '@ui/icons';
import { Text } from '@ui/components';
import { useFormatter } from 'next-intl';

import { isSameDay } from 'date-fns';

export interface EventDatesClientProps {
  eventDateLocations: EventDateLocation[];
  detailed?: boolean;
  fromText: string;
  toText: string;
}

const style = {
  date: 'text-base font-semibold',
  hourMinutes: 'text-base font-semibold',
}; // Import isSameDay from date-fns or another library

// EventDateComponent
const EventDateComponent: React.FC<{
  dateStart: string;
  dateEnd: string;
  fromText: string;
  toText: string;
}> = ({ dateStart, dateEnd, fromText, toText }) => {
  const format = useFormatter();
  const formatDateTime = (date: string, options: any) =>
    format.dateTime(new Date(date), options);

  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);

  if (isSameDay(startDate, endDate)) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <Text className={`col-span-2 flex items-center ${style.date}`}>
          {formatDateTime(dateStart, {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
        <div className="col-span-2">
          <Text className="flex space-x-2">
            <span>{fromText}</span>
            <span className={style.hourMinutes}>
              {formatDateTime(dateStart, {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          </Text>
          <Text className="flex space-x-2">
            <span>{toText}</span>
            <span className={style.hourMinutes}>
              {formatDateTime(dateEnd, {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          </Text>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Text className="flex space-x-2">
          <span>{fromText}</span>
          <span className={style.date}>
            {formatDateTime(dateStart, {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </span>
        </Text>
        <Text className="flex space-x-2">
          <span>{toText}</span>
          <span className={style.date}>
            {formatDateTime(dateEnd, {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </span>
        </Text>
      </div>
    );
  }
};

// EventDatesClient

export const EventDatesClient: React.FC<EventDatesClientProps> = ({
  eventDateLocations,
  detailed,
  fromText,
  toText,
}) => {
  if (!eventDateLocations.length) return null;

  const commonDate = eventDateLocations[0];

  return (
    <div className="flex items-center space-x-4">
      <CalendarIcon size="lg" flex />
      <div className="flex flex-col items-start space-y-4">
        {eventDateLocations.length > 1 && !detailed ? (
          <EventDateComponent
            dateStart={commonDate.dateStart}
            dateEnd={eventDateLocations[eventDateLocations.length - 1].dateEnd}
            fromText={fromText}
            toText={toText}
          />
        ) : (
          eventDateLocations.map((eventDate, index) => (
            <EventDateComponent
              key={index}
              dateStart={eventDate.dateStart}
              dateEnd={eventDate.dateEnd}
              fromText={fromText}
              toText={toText}
            />
          ))
        )}
      </div>
    </div>
  );
};
