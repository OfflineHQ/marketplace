import { Accordion } from '@ui/components';
import type {
  AllPassesCart,
  EventSlugs,
} from '@features/organizer/event/types';
import { type EventPassesClientProps } from '../EventPasses/EventPassesClient';

export interface EventPassListProps {
  deletePasses: (props: EventSlugs) => void;
  allPasses?: AllPassesCart;
  EventPassesFetcher: React.FC<EventPassesClientProps>;
}

export const EventPassList: React.FC<EventPassListProps> = ({
  deletePasses,
  allPasses,
  EventPassesFetcher,
}) => {
  return (
    <Accordion type="multiple">
      {Object.entries(allPasses || {}).map(([organizerSlug, events], index) => (
        <div key={organizerSlug + index}>
          {Object.entries(events).map(([eventSlug, eventPasses], index) => (
            <div key={organizerSlug + eventSlug + index}>
              <EventPassesFetcher
                onDelete={deletePasses}
                organizerSlug={organizerSlug}
                eventSlug={eventSlug}
                passes={eventPasses}
              />
            </div>
          ))}
        </div>
      ))}
    </Accordion>
  );
};
