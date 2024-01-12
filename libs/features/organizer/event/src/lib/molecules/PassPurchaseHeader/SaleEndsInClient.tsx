import { EventParametersPasses } from '@features/organizer/event-types';
import { useRouter } from '@next/navigation';
import { UTCDateMini, getSteppedIntervalTime } from '@time';
import { Badge } from '@ui/components';
import { Timer } from '@ui/icons';
import { isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface SaleEndsInClientProps
  extends Pick<
    EventParametersPasses,
    'dateSaleEnd' | 'timezone' | 'isSaleOngoing'
  > {}

export const SaleEndsInClient: React.FC<SaleEndsInClientProps> = ({
  dateSaleEnd,
  timezone,
  isSaleOngoing,
}) => {
  const t = useTranslations('Organizer.Event.SaleEndsInClient');
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const dateSaleEndObj = utcToZonedTime(dateSaleEnd, timezone);
  const [saleEndsIn, setSaleEndsIn] = useState<string>();
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const format = useFormatter();
  useEffect(() => {
    const updateSaleEndsIn = () => {
      const nowInUTC = new UTCDateMini();
      if (isAfter(nowInUTC, dateSaleEndObj)) {
        setSaleEndsIn(format.relativeTime(dateSaleEndObj, nowInUTC));
      } else if (!isSaleOngoing && !hasAttemptedRefresh) {
        router.refresh();
        setHasAttemptedRefresh(true);
      }

      const diffInSeconds =
        (dateSaleEndObj.getTime() - nowInUTC.getTime()) / 1000;
      if (diffInSeconds < 0) {
        clearTimeout(timeoutId.current as NodeJS.Timeout);
        return;
      }
      const intervalTime = getSteppedIntervalTime(diffInSeconds, [
        { threshold: 24 * 60 * 60, interval: 1000 * 60 * 60 },
        { threshold: 60 * 60, interval: 1000 * 60 },
        { threshold: 60, interval: 1000 },
      ]);
      timeoutId.current = setTimeout(updateSaleEndsIn, intervalTime);
    };

    updateSaleEndsIn();

    return () => {
      clearTimeout(timeoutId.current as NodeJS.Timeout);
    };
  }, [hasAttemptedRefresh, dateSaleEndObj, format, isSaleOngoing, router]);

  return (
    <Badge variant="warning" icon={<Timer />}>
      {t('sale-ends-in', { time: saleEndsIn })}
    </Badge>
  );
};
