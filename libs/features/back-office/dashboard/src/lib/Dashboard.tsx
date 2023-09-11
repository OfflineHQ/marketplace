import { EventCards, type EventCardsProps } from './EventCards';

interface OrganizerDashboardProps extends Omit<EventCardsProps, 'events'> {
  events?: EventCardsProps['events'];
}

export async function OrganizerDashboard({
  events,
  organizerId,
}: OrganizerDashboardProps) {
  return events && events.length ? (
    <EventCards events={events} organizerId={organizerId} />
  ) : (
    <p>No event at the moment for {organizerId}</p>
  );
}
