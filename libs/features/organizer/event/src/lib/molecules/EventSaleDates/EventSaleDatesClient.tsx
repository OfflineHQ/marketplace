'use client';
import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import { UTCDateMini } from '@time';
import { Alert, AlertSkeleton, Badge } from '@ui/components';
import { Timer } from '@ui/icons';
import { isAfter, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export type EventSaleDatesClientProps = {
  eventParameters: EventParametersPasses;
};

export const EventSaleDatesClient: React.FC<EventSaleDatesClientProps> = ({
  eventParameters: { timezone, dateSaleStart, dateSaleEnd },
}) => {
  const t = useTranslations('Organizer.Event.EventSaleDates');
  const format = useFormatter();

  // Convert dateSaleStart and dateSaleEnd to Date objects in the event's timezone
  const dateSaleStartObj = utcToZonedTime(dateSaleStart, timezone);
  const dateSaleEndObj = utcToZonedTime(dateSaleEnd, timezone);

  const [saleStatus, setSaleStatus] = useState<SaleStatus>();
  const [saleEndsIn, setSaleEndsIn] = useState<string>();
  const [saleStartsIn, setSaleStartsIn] = useState<string>();

  useEffect(() => {
    const updateSaleStatus = () => {
      const nowInUTC = new UTCDateMini();
      if (isBefore(nowInUTC, dateSaleStartObj)) {
        setSaleStatus(SaleStatus.NotStarted);
        setSaleStartsIn(format.relativeTime(dateSaleStartObj, nowInUTC));
      } else if (isAfter(nowInUTC, dateSaleEndObj)) {
        setSaleStatus(SaleStatus.Ended);
      } else {
        setSaleStatus(SaleStatus.Ongoing);
        setSaleEndsIn(format.relativeTime(dateSaleEndObj, nowInUTC));
      }
    };

    updateSaleStatus(); // Call the function once before setting the interval

    const intervalId = setInterval(updateSaleStatus, 1000 * 10); // Run every 10 seconds

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [dateSaleEndObj, dateSaleStartObj, format]);
  return !saleStatus ? (
    <AlertSkeleton />
  ) : (
    <Alert variant="info" className="flex flex-col">
      <span>
        {saleStatus === SaleStatus.NotStarted && t('sale-not-started')}
        {saleStatus === SaleStatus.Ongoing && t('sale-ongoing')}
        {saleStatus === SaleStatus.Ended && t('sale-ended')}
      </span>
      <span>
        {saleStatus === SaleStatus.NotStarted && (
          <Badge variant="success" icon={<Timer />}>
            {t('sale-starts-in', { time: saleStartsIn })}
          </Badge>
        )}
        {saleStatus === SaleStatus.Ongoing && (
          <Badge variant="warning" icon={<Timer />}>
            {t('sale-ends-in', { time: saleEndsIn })}
          </Badge>
        )}
      </span>
    </Alert>
  );
};
