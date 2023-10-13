'use server';

import { FC } from 'react';
import { DateRange } from '../DateRange/DateRangeServer';
import { type EventDatesClientProps } from './EventDatesClient';
export type EventDatesServerProps = Omit<
  EventDatesClientProps,
  'fromText' | 'toText' | 'inYourTimezoneText' | 'fromHourText' | 'toHourText'
>;

export const EventDates: FC<EventDatesServerProps> = async ({
  eventDateLocations,
  detailed,
}) => {
  if (!eventDateLocations.length) return null;
  const commonDate = eventDateLocations[0];
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-start space-y-4">
        {eventDateLocations.length > 1 && !detailed ? (
          <DateRange
            dateStart={commonDate.dateStart}
            dateEnd={eventDateLocations[eventDateLocations.length - 1].dateEnd}
            timezone="UTC"
          />
        ) : (
          eventDateLocations.map((eventDate, index) => (
            <DateRange
              key={index}
              dateStart={eventDate.dateStart}
              dateEnd={eventDate.dateEnd}
              timezone="UTC"
            />
          ))
        )}
      </div>
    </div>
  );
};
