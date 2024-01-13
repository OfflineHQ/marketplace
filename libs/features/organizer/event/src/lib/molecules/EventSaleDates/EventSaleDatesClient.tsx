'use client';
import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import { UTCDateMini, getSteppedIntervalTime } from '@time';
import {
  Alert,
  AlertDescription,
  AlertSkeleton,
  AlertTitle,
  Badge,
} from '@ui/components';
import { Timer } from '@ui/icons';
import { isAfter, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export type EventSaleDatesClientProps = {
  eventParameters: EventParametersPasses;
};

export const EventSaleDatesClient: React.FC<EventSaleDatesClientProps> = ({
  eventParameters: { timezone, dateSaleStart, dateSaleEnd },
}) => {
  const t = useTranslations('Organizer.Event.EventSaleDates');
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Declare a ref to store the timeout ID
  const format = useFormatter();

  // Convert dateSaleStart and dateSaleEnd to Date objects in the event's timezone
  const dateSaleStartObj = utcToZonedTime(dateSaleStart, timezone);
  const dateSaleEndObj = utcToZonedTime(dateSaleEnd, timezone);

  const [saleStatus, setSaleStatus] = useState<SaleStatus>();
  const [saleEndsIn, setSaleEndsIn] = useState<string>();
  const [saleStartsIn, setSaleStartsIn] = useState<string>();

  useEffect(() => {
    const updateSaleStatusAndCountdown = () => {
      const nowInUTC = new UTCDateMini();
      console.log('nowInUTC:', nowInUTC);
      let diffInSeconds;
      if (isBefore(nowInUTC, dateSaleStartObj)) {
        setSaleStatus(SaleStatus.NotStarted);
        setSaleStartsIn(format.relativeTime(dateSaleStartObj, nowInUTC));
        diffInSeconds =
          (dateSaleStartObj.getTime() - nowInUTC.getTime()) / 1000;
      } else if (isAfter(nowInUTC, dateSaleEndObj)) {
        setSaleStatus(SaleStatus.Ended);
        return;
      } else {
        setSaleStatus(SaleStatus.Ongoing);
        console.log('dateSaleEndObj:', dateSaleEndObj); // Add this line
        console.log('nowInUTC:', nowInUTC); // Add this line
        setSaleEndsIn(format.relativeTime(dateSaleEndObj, nowInUTC));
        diffInSeconds = (dateSaleEndObj.getTime() - nowInUTC.getTime()) / 1000;
      }

      const intervalTime = getSteppedIntervalTime(diffInSeconds, [
        { threshold: 24 * 60 * 60, interval: 1000 * 60 * 60 },
        { threshold: 60 * 60, interval: 1000 * 60 },
        { threshold: 60, interval: 1000 },
      ]);

      timeoutId.current = setTimeout(
        updateSaleStatusAndCountdown,
        intervalTime,
      );
    };

    const nowInUTC = new UTCDateMini();
    console.log('nowInUTC:', nowInUTC);

    updateSaleStatusAndCountdown();

    // Clear timeout on component unmount
    return () => {
      clearTimeout(timeoutId.current as NodeJS.Timeout);
    };
  }, [dateSaleEndObj, dateSaleStartObj, format]);

  return !saleStatus ? (
    <AlertSkeleton />
  ) : (
    <Alert variant="info" className="md:max-w-xl">
      <AlertTitle>
        {saleStatus === SaleStatus.NotStarted && t('sale-not-started')}
        {saleStatus === SaleStatus.Ongoing && t('sale-ongoing')}
        {saleStatus === SaleStatus.Ended && t('sale-ended')}
      </AlertTitle>
      <AlertDescription>
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
      </AlertDescription>
    </Alert>
  );
};
