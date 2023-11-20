import { EventCards, type EventCardsProps } from './EventCards';
import {
  NoEventsPlaceholder,
  NoEventsPlaceholderProps,
} from './molecules/NoEventsPlaceholder/NoEventsPlaceholder';

interface OrganizerEventsProps
  extends Omit<EventCardsProps, 'events'>,
    NoEventsPlaceholderProps {
  events?: EventCardsProps['events'];
}

export async function OrganizerEvents({
  events,
  organizerId,
  noEventsImage,
  noEventsText,
}: OrganizerEventsProps) {
  return events && events.length ? (
    <EventCards events={events} organizerId={organizerId} />
  ) : (
    <NoEventsPlaceholder
      noEventsImage={noEventsImage}
      noEventsText={noEventsText}
    />
  );
}
