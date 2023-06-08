import { getEventCart } from '../api/getEventCart';
import { EventPasses, type EventPassesProps } from './EventPasses';

export interface EventPassesServerProps
  extends Pick<EventPassesProps, 'passes' | 'onDelete'> {
  organizerSlug: string;
  eventSlug: string;
}

export default async function EventPassesServer({
  organizerSlug,
  eventSlug,
  ...eventPassesProps
}: EventPassesServerProps) {
  const event = await getEventCart({ organizerSlug, eventSlug });
  return <EventPasses event={event} {...eventPassesProps} />;
}
