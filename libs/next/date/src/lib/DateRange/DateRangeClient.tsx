'use client';

import { Calendar as CalendarIcon } from '@ui/icons';
import { cn } from '@ui/shared';
import { useFormatter } from 'next-intl';
import { DateRangeContent } from './DateRangeContent';
import {
  UserTimezoneInfoHover,
  type UserTimezoneInfoHoverProps,
} from './UserTimezoneInfoHover';

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
  return (
    <div
      className={cn(
        `my-2 flex items-center space-x-${userTimezone !== timezone ? 2 : 4}`,
        className,
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
        dateStart={dateStart}
        dateEnd={dateEnd}
        format={format}
        timezone={timezone}
        {...textProps}
      />
    </div>
  );
}
