'use server';

import { Accordion } from '@ui/components';
import type {
  AllPassesCart,
  EventSlugs,
} from '@features/organizer/event/types';
import type { EventPassesServerProps } from '../EventPasses/EventPassesServer';

export interface EventPassListProps {
  deletePasses: (props: EventSlugs) => void;
  allPasses?: AllPassesCart;
  EventPassesServer: React.FC<EventPassesServerProps>;
}

export const EventPassList: React.FC<EventPassListProps> = ({
  deletePasses,
  allPasses,
  EventPassesServer,
}) => {
  return (
    <Accordion type="multiple">
      {Object.entries(allPasses || {}).map(([organizerSlug, events], index) => (
        <div key={organizerSlug + index}>
          {Object.entries(events).map(([eventSlug, eventPasses], index) => (
            <div key={organizerSlug + eventSlug + index}>
              <EventPassesServer
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
