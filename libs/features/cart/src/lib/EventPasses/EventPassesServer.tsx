'use server';

import { Suspense } from 'react';
import { getEventCart } from '../api/getEventCart';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from './EventPasses';

export interface EventPassesServerProps
  extends Pick<EventPassesProps, 'passes' | 'onDelete'> {
  organizerSlug: string;
  eventSlug: string;
}

async function EventPassesFetch({
  organizerSlug,
  eventSlug,
  ...eventPassesProps
}: EventPassesServerProps) {
  const event = await getEventCart({ organizerSlug, eventSlug });
  return <EventPasses event={event} {...eventPassesProps} />;
}

export async function EventPassesServer(props: EventPassesServerProps) {
  return (
    <Suspense fallback={<EventPassesSkeleton />}>
      <EventPassesFetch {...props} />
    </Suspense>
  );
}

// export async function EventPassesServer({
//   organizerSlug,
//   eventSlug,
//   passes,
// }: EventPassesServerProps) {
//   const event = await getEventCart({ organizerSlug, eventSlug });
//   return <EventPasses event={event} passes={passes} />;
// }
