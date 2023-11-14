import { EventCards, type EventCardsProps } from './EventCards';

interface OrganizerEventsProps extends Omit<EventCardsProps, 'events'> {
  events?: EventCardsProps['events'];
}

export async function OrganizerEvents({
  events,
  organizerId,
}: OrganizerEventsProps) {
  return events && events.length ? (
    <EventCards events={events} organizerId={organizerId} />
  ) : (
    <p>No event at the moment for {organizerId}</p>
  );
}
