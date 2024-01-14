'use client';

import {
  Alert,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  AlertTitle,
} from '@ui/components';
import { FillInfo as InfoIcon } from '@ui/icons'; // Import Info icon
import { useFormatter } from 'next-intl';
import { FC } from 'react';
import {
  DateRangeContent,
  type DateRangeContentProps,
} from './DateRangeContent';

export interface UserTimezoneInfoHoverProps
  extends Omit<DateRangeContentProps, 'format' | 'timezone'> {
  userTimezone: string;
  inYourTimezoneText: string;
  className?: string;
}

export const UserTimezoneInfoHover: FC<UserTimezoneInfoHoverProps> = ({
  dateStart,
  dateEnd,
  userTimezone,
  inYourTimezoneText,
  className,
  ...textProps
}) => {
  // Convert dates to user's local timezone
  const format = useFormatter();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          icon={<InfoIcon className="text-info" />}
          onClick={(event) => {
            event.stopPropagation();
          }}
          variant="ghost"
          className={className}
        ></Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <Alert variant="info" className="mb-2 text-base">
          <AlertTitle>
            {inYourTimezoneText}: {userTimezone}
          </AlertTitle>
        </Alert>
        <DateRangeContent
          format={format}
          timezone={userTimezone}
          dateStart={dateStart}
          dateEnd={dateEnd}
          {...textProps}
        />
      </HoverCardContent>
    </HoverCard>
  );
};
