import { FC } from 'react';
import {
  Button,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Alert,
} from '@ui/components';
import { FillInfo as InfoIcon } from '@ui/icons'; // Import Info icon
import { useFormatter } from 'next-intl';
import { DateRangeContent } from './DateRangeContent';

export interface UserTimezoneInfoHoverProps {
  dateStart: string;
  dateEnd: string;
  userTimezone: string;
  fromText: string;
  toText: string;
  inYourTimezoneText: string;
  className?: string;
}

export const UserTimezoneInfoHover: FC<UserTimezoneInfoHoverProps> = ({
  dateStart,
  dateEnd,
  userTimezone,
  fromText,
  toText,
  inYourTimezoneText,
  className,
}) => {
  // ...existing code...

  // Convert dates to user's local timezone
  const format = useFormatter();
  const formattedStart = format.dateTime(new Date(dateStart), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: userTimezone,
  });

  const formattedEnd = format.dateTime(new Date(dateEnd), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: userTimezone,
  });
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
          {inYourTimezoneText}: {userTimezone}
        </Alert>
        <DateRangeContent
          formattedStart={formattedStart}
          formattedEnd={formattedEnd}
          fromText={fromText}
          toText={toText}
        />
      </HoverCardContent>
    </HoverCard>
  );
};
