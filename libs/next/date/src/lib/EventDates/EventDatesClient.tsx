// EventDatesClient.tsx

'use client';

import type { EventDateLocation } from '@features/organizer/event-types';
import React from 'react';
import DateRangeClient, {
  type DateRangeClientProps,
} from '../DateRange/DateRangeClient';

export interface EventDatesClientProps
  extends Omit<DateRangeClientProps, 'timezone' | 'dateStart' | 'dateEnd'> {
  eventDateLocations: EventDateLocation[];
  detailed?: boolean;
}

// EventDatesClient

export const EventDatesClient: React.FC<EventDatesClientProps> = ({
  eventDateLocations,
  detailed,
  ...textProps
}) => {
  if (!eventDateLocations.length) return null;

  const commonDate = eventDateLocations[0];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-start space-y-4">
        {eventDateLocations.length > 1 && !detailed ? (
          <DateRangeClient
            dateStart={commonDate.dateStart}
            dateEnd={eventDateLocations[eventDateLocations.length - 1].dateEnd}
            timezone="UTC"
            {...textProps}
          />
        ) : (
          eventDateLocations.map((eventDate, index) => (
            <DateRangeClient
              key={index}
              dateStart={eventDate.dateStart}
              dateEnd={eventDate.dateEnd}
              timezone="UTC"
              {...textProps}
            />
          ))
        )}
      </div>
    </div>
  );
};
