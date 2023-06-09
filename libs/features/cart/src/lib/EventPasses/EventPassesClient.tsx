'use client';

import { getEventCart } from '../api/getEventCart';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from './EventPasses';

import { useQuery } from '@tanstack/react-query';

export interface EventPassesClientProps
  extends Pick<EventPassesProps, 'passes' | 'onDelete'> {
  organizerSlug: string;
  eventSlug: string;
}
export function EventPassesClient({
  organizerSlug,
  eventSlug,
  passes,
  onDelete,
}: EventPassesClientProps) {
  const { data, isLoading, isFetching, error } = useQuery(
    ['EventCart', organizerSlug, eventSlug],
    () => getEventCart({ organizerSlug, eventSlug })
  );
  if (error) {
    console.error(error);
    return null;
  }
  return isLoading || isFetching || !data ? (
    <EventPassesSkeleton />
  ) : (
    <EventPasses event={data} passes={passes} onDelete={onDelete} />
  );
}
