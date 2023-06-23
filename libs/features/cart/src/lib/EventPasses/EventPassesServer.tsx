import { getEventCart } from '../api/getEventCart';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from './EventPasses';

import { useQuery } from '@tanstack/react-query';

export interface EventPassesServerProps
  extends Pick<EventPassesProps, 'passes' | 'onDelete'> {
  organizerSlug: string;
  eventSlug: string;
}

// async function EventPassesFetch({
//   organizerSlug,
//   eventSlug,
//   ...eventPassesProps
// }: EventPassesServerProps) {
//   const event = await getEventCart({ organizerSlug, eventSlug });
//   console.log('EventPassesFetch', { event, eventPassesProps });
//   return <EventPasses event={event} {...eventPassesProps} />;
// }

// export function EventPassesServer(props: EventPassesServerProps) {
//   console.log('EventPassesServer', { props });
//   return (
//     <Suspense fallback={<EventPassesSkeleton />}>
//       <EventPassesFetch {...props} />
//     </Suspense>
//   );
// }

export function EventPassesServer({
  organizerSlug,
  eventSlug,
  passes,
  onDelete,
}: EventPassesServerProps) {
  // TODO replace with sync with EventPassOrders from server (first fetch from server, then sync with client (create or delete). Creation should check if there are enough tickets available. If get error show error message indicating the ticket is sold out)
  const { data, isLoading, isFetching, error } = useQuery(
    ['EventCart', organizerSlug, eventSlug],
    () => getEventCart({ organizerSlug, eventSlug })
  );
  console.log('EventPassesServer', { data, passes });
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
