'use server';

import { Calendar as CalendarIcon } from '@ui/icons';
import { cn } from '@ui/shared';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { getFormatter, getTimeZone, getTranslator } from 'next-intl/server';
import { FC, Suspense } from 'react';
import { DateRangeSkeleton } from './DateRange';
import { DateRangeContent } from './DateRangeContent';
import {
  UserTimezoneInfoHover,
  type UserTimezoneInfoHoverProps,
} from './UserTimezoneInfoHover';

export interface DateRangeServerProps
  extends Omit<UserTimezoneInfoHoverProps, 'userTimezone'> {
  timezone: string;
}

export type DateRangeProps = Omit<
  DateRangeServerProps,
  'fromText' | 'toText' | 'inYourTimezoneText' | 'fromHourText' | 'toHourText'
>;

async function DateRangeServer({
  dateStart,
  dateEnd,
  timezone,
  className,
}: DateRangeProps) {
  const locale = useLocale();
  const t = await getTranslator(locale, 'Pass.UserPass.DateRange');
  const userTimezone = await getTimeZone(locale);
  const format = await getFormatter(locale);
  const textProps = {
    fromText: t('from'),
    toText: t('to'),
    inYourTimezoneText: t('in-your-timezone'),
    fromHourText: t('from-hour'),
    toHourText: t('to-hour'),
  };

  return (
    <div
      className={cn(
        `my-2 flex items-center space-x-${userTimezone !== timezone ? 2 : 4}`,
        className,
      )}
    >
      <CalendarIcon size="lg" flex />
      {userTimezone !== timezone && (
        <NextIntlClientProvider locale={locale} messages={undefined}>
          <UserTimezoneInfoHover
            className="md:mr-2"
            dateStart={dateStart}
            dateEnd={dateEnd}
            userTimezone={userTimezone}
            {...textProps}
          />
        </NextIntlClientProvider>
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

export const DateRange: FC<DateRangeProps> = async (props) => {
  return (
    <Suspense fallback={<DateRangeSkeleton />}>
      <DateRangeServer {...props} />
    </Suspense>
  );
};
