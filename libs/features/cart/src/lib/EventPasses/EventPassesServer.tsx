import { getEventCart } from '../api/getEventCart';
import { EventPasses, type EventPassesProps } from './EventPasses';

export interface EventPassesServerProps {
  organizerSlug: string;
  eventSlug: string;
  passes: EventPassesProps['passes'];
}

export default async function EventPassesServer({
  organizerSlug,
  eventSlug,
  passes,
}: EventPassesServerProps) {
  const event = await getEventCart({ organizerSlug, eventSlug });
  return <EventPasses event={event} passes={passes} />;
}
