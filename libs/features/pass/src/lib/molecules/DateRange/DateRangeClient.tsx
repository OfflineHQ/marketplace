'use client';

import { useFormatter } from 'next-intl';
import React, { FC } from 'react';
import { Text } from '@ui/components';
import { Calendar as CalendarIcon } from '@ui/icons';
import { cn } from '@ui/shared';

export interface DateRangeClientProps {
  dateStart: Date;
  dateEnd: Date;
  fromText: string;
  toText: string;
  className?: string;
}

export const DateRangeClient: FC<DateRangeClientProps> = ({
  dateStart,
  dateEnd,
  fromText,
  toText,
  className,
}) => {
  const format = useFormatter();

  const formattedStart = format.dateTime(new Date(dateStart), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const formattedEnd = format.dateTime(new Date(dateEnd), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    // <Text variant="span" className="text-info">
    //   {formattedStart} - {formattedEnd}
    // </Text>
    <div className={cn('my-2 flex items-center space-x-4', className)}>
      <CalendarIcon size="lg" flex />
      <div className="grid grid-flow-row-dense grid-cols-4 grid-rows-2 gap-1.5 md:gap-3">
        <div className="col-auto flex w-fit space-x-2 pr-2">
          <Text>{fromText}</Text>
        </div>
        <div className="col-span-3 flex space-x-2">
          <Text className="text-base font-semibold">{formattedStart}</Text>
        </div>
        <div className="col-auto flex w-fit space-x-2 pr-2">
          <Text>{toText}</Text>
        </div>
        <div className="col-span-3 flex space-x-2">
          <Text className="text-base font-semibold">{formattedEnd}</Text>
        </div>
      </div>
    </div>
  );
};
