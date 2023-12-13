'use client';
import { useNow } from '@next/i18n-ui';
import { Badge } from '@ui/components';
import { Timer } from '@ui/icons';
import { useFormatter, useTranslations } from 'next-intl';

export type EventPassTimeBeforeDeletionClientProps = {
  timeBeforeDelete: number;
  created_at: string;
};

export const EventPassTimeBeforeDeletionClient: React.FC<
  EventPassTimeBeforeDeletionClientProps
> = ({ timeBeforeDelete, created_at }) => {
  const t = useTranslations('Cart.List.Event.TimeBeforeDeletion');
  const now = useNow({
    // Update every 10 seconds
    updateInterval: 1000 * 10,
  });
  const format = useFormatter();

  // Calculate the deletion time
  const deletionTime = new Date(
    new Date(created_at).getTime() + timeBeforeDelete * 1000,
  );
  return (
    <Badge variant="orange" icon={<Timer />}>
      {t('time-before-deletion', {
        relativeTime: format.relativeTime(deletionTime, now),
      })}
    </Badge>
  );
};
