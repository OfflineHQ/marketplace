'use client';
import { UTCDate } from '@date-fns/utc';
import { EventParameters, SaleStatus } from '@features/organizer/event-types';
import { useNow } from '@next/i18n-ui';
import { Badge } from '@ui/components';
import { Timer } from '@ui/icons';
import { isAfter, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useFormatter, useTranslations } from 'next-intl';

export type EventSaleDatesClientProps = {
  eventParameters: EventParameters;
};

export const EventSaleDatesClient: React.FC<EventSaleDatesClientProps> = ({
  eventParameters: { timezone, dateSaleStart, dateSaleEnd },
}) => {
  const t = useTranslations('Organizer.Event.EventSaleDates');
  const now = useNow({
    // Update every seconds
    updateInterval: 1000,
  });
  // Now in UTC
  const nowInUTC = new UTCDate(now.getTime());
  const format = useFormatter();

  // Convert dateSaleStart and dateSaleEnd to Date objects in the event's timezone
  const dateSaleStartObj = utcToZonedTime(dateSaleStart, timezone);
  const dateSaleEndObj = utcToZonedTime(dateSaleEnd, timezone);

  let saleStatus: SaleStatus;
  if (isBefore(nowInUTC, dateSaleStartObj)) {
    saleStatus = SaleStatus.NotStarted;
  } else if (isAfter(nowInUTC, dateSaleEndObj)) {
    saleStatus = SaleStatus.Ended;
  } else {
    saleStatus = SaleStatus.Ongoing;
  }
  console.log({
    nowInEventTimezone: nowInUTC,
    dateSaleStartObj: dateSaleStartObj,
    dateSaleEndObj: dateSaleEndObj,
    saleStatus,
  });
  return (
    <Badge variant="orange" icon={<Timer />}>
      {saleStatus}
    </Badge>
  );
};
