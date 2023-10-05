'use client';

import { useLocale } from 'next-intl';
import { useGetEventWithPassesQuery } from '@gql/anonymous/react-query';
import type { Locale, Stage } from '@gql/shared/types';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from './EventPasses';
import env from '@env/client';

export interface EventPassesAnonymousProps
  extends Pick<EventPassesProps, 'passes' | 'onDelete'> {
  organizerSlug: string;
  eventSlug: string;
}
export function EventPassesAnonymous({
  organizerSlug,
  eventSlug,
  passes,
  onDelete,
}: EventPassesAnonymousProps) {
  const locale = useLocale();
  const { data, isLoading, isFetching, error } = useGetEventWithPassesQuery({
    slug: eventSlug,
    locale: locale as Locale,
    stage: env.NEXT_PUBLIC_HYGRAPH_STAGE as Stage,
  });
  if (error) {
    console.error(error);
    return null;
  }
  return isLoading || isFetching || !data || !data.event ? (
    <EventPassesSkeleton />
  ) : (
    <EventPasses event={data.event} passes={passes} onDelete={onDelete} />
  );
}
