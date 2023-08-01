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
    ordersIsFetching,
    upsertOrders,
    deleteOrders,
  } = useEventPassOrders({
    organizerSlug,
    eventSlug,
    locale: locale as Locale,
  });

  const handleDelete = async (props: EventSlugs) => {
    await deleteOrders(passes);
    onDelete(props);
  };

  useEffect(() => {
    // Here make sure that the event data with all the available passes is loaded
    // Additionally, make sure that the orders data is loaded and is not fetching to sync the local storage with the server and make sure that orders are not duplicated
    if (
      ordersData?.eventPassPendingOrder &&
      !ordersIsFetching &&
      !eventIsLoading
    )
      upsertOrders(passes);
  }, [
    passes,
    ordersData?.eventPassPendingOrder,
    eventIsLoading,
    ordersIsFetching,
  ]);

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
