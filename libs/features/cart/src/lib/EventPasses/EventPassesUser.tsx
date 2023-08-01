'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from './EventPasses';
import { useEventPassOrders } from './useEventPassOrders';
import { EventSlugs } from '@features/organizer/event/types';
import type { Locale } from '@gql/shared/types';

export interface EventPassesUserProps
  extends Pick<EventPassesProps, 'passes' | 'onDelete'> {
  organizerSlug: string;
  eventSlug: string;
}
export function EventPassesUser({
  organizerSlug,
  eventSlug,
  passes,
  onDelete,
}: EventPassesUserProps) {
  const locale = useLocale();
  const {
    eventData,
    eventIsLoading,
    ordersData,
    ordersIsLoading,
    upsertOrders,
    deleteOrders,
  } = useEventPassOrders({
    organizerSlug,
    eventSlug,
    locale: locale as Locale,
  });

  const handleDelete = async (props: EventSlugs) => {
    // TODO implement optimistic delete, first copy from localStorage, then apply onDelete then deleteOrders, if fail then set back to localStorage and show error
    await deleteOrders(passes);
    onDelete(props);
  };

  useEffect(() => {
    if (ordersData && !ordersIsLoading) upsertOrders(passes);
  }, [passes, ordersData, ordersIsLoading]);

  if (
    eventIsLoading ||
    ordersIsLoading ||
    !eventData ||
    !eventData.event ||
    !ordersData
  ) {
    return <EventPassesSkeleton />;
  }

  return (
    <EventPasses
      event={eventData.event}
      passes={passes}
      onDelete={handleDelete}
    />
  );
}
