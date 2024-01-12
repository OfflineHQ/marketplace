'use client';

import { EventParametersPasses } from '@features/organizer/event-types';
import { useRouter } from '@next/navigation';
import { UTCDateMini, getSteppedIntervalTime } from '@time';
import { Badge } from '@ui/components';
import { Timer } from '@ui/icons';
import { isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface SaleStartsInClientProps
  extends Pick<
    EventParametersPasses,
    'dateSaleStart' | 'timezone' | 'isSaleOngoing'
  > {}

export const SaleStartsInClient: React.FC<SaleStartsInClientProps> = ({
  dateSaleStart,
  timezone,
  isSaleOngoing,
}) => {
  const t = useTranslations('Organizer.Event.SaleStartsInClient');
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Declare a ref to store the timeout ID
  const router = useRouter();
  const dateSaleStartObj = utcToZonedTime(dateSaleStart, timezone);
  const [saleStartsIn, setSaleStartsIn] = useState<string>();
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const format = useFormatter();
  useEffect(() => {
    const updateSaleStartsIn = () => {
      const nowInUTC = new UTCDateMini();
      if (isBefore(nowInUTC, dateSaleStartObj)) {
        setSaleStartsIn(format.relativeTime(dateSaleStartObj, nowInUTC));
      } else if (!isSaleOngoing && !hasAttemptedRefresh) {
        // Only refresh once if the sale is not ongoing
        router.refresh();
        setHasAttemptedRefresh(true);
      }

      const diffInSeconds =
        (dateSaleStartObj.getTime() - nowInUTC.getTime()) / 1000;
      if (diffInSeconds < 0) {
        clearTimeout(timeoutId.current as NodeJS.Timeout);
        return;
      }
      const intervalTime = getSteppedIntervalTime(diffInSeconds, [
        { threshold: 24 * 60 * 60, interval: 1000 * 60 * 60 }, // before 24 hours and until 1 hour, update every hours
        { threshold: 60 * 60, interval: 1000 * 60 }, // after 1 hour and until 1 minute, update every minute
        { threshold: 60, interval: 1000 }, // after 1 minute, update every second
      ]);
      console.log('intervalTime, diffInSeconds', intervalTime, diffInSeconds);
      timeoutId.current = setTimeout(updateSaleStartsIn, intervalTime);
    };

    updateSaleStartsIn(); // Call the function once before setting the interval

    // Clear timeout on component unmount
    return () => {
      clearTimeout(timeoutId.current as NodeJS.Timeout);
    };
  }, [hasAttemptedRefresh, dateSaleStartObj, format, isSaleOngoing, router]);

  return (
    <Badge variant="success" icon={<Timer />}>
      {t('sale-starts-in', { time: saleStartsIn })}
    </Badge>
  );
};
