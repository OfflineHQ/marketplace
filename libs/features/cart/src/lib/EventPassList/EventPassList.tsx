import type {
  AllPassesCart,
  EventSlugs,
} from '@features/organizer/event/types';
import type { EventPassesServerProps } from '../EventPasses/EventPassesServer';

export interface EventPassListProps {
  deletePasses: (props: EventSlugs) => void;
  allPasses?: AllPassesCart;
  EventPassServer: React.FC<EventPassesServerProps>;
}

export const EventPassList: React.FC<EventPassListProps> = ({
  deletePasses,
  allPasses,
  EventPassServer,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(allPasses || {}).map(([organizerSlug, events]) => (
        <div key={organizerSlug}>
          {Object.entries(events).map(([eventSlug, eventPasses]) => (
            <div key={organizerSlug + eventSlug}>
              <EventPassServer
                onDelete={deletePasses}
                organizerSlug={organizerSlug}
                eventSlug={eventSlug}
                passes={eventPasses}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
