'use client';

import { useFormatter } from 'next-intl';
import React, { FC } from 'react';
import { Calendar as CalendarIcon } from '@ui/icons';
import { cn } from '@ui/shared';
import {
  UserTimezoneInfoHover,
  type UserTimezoneInfoHoverProps,
} from './UserTimezoneInfoHover';
import { DateRangeContent } from './DateRangeContent';

export interface DateRangeClientProps
  extends Omit<UserTimezoneInfoHoverProps, 'userTimezone'> {
  timezone: string;
}

export default function DateRangeClient({
  dateStart,
  dateEnd,
  timezone,
  className,
  ...textProps
}: DateRangeClientProps) {
  const format = useFormatter();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedStart = format.dateTime(new Date(dateStart), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });

  const formattedEnd = format.dateTime(new Date(dateEnd), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });

  return (
    <div
      className={cn(
        `my-2 flex items-center space-x-${userTimezone !== timezone ? 2 : 4}`,
        className
      )}
    >
      <CalendarIcon size="lg" flex />
      {userTimezone !== timezone && (
        <UserTimezoneInfoHover
          className="md:mr-2"
          dateStart={dateStart}
          dateEnd={dateEnd}
          userTimezone={userTimezone}
          {...textProps}
        />
      )}
      <DateRangeContent
        formattedStart={formattedStart}
        formattedEnd={formattedEnd}
        {...textProps}
      />
    </div>
  );
}
