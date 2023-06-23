import React from 'react';

import { Accordion } from '@ui/components';
import type {
  AllPassesCart,
  EventSlugs,
} from '@features/organizer/event/types';
import { EventPassesSkeleton } from '../EventPasses/EventPasses';
import { type EventPassesClientProps } from '../EventPasses/EventPassesClient';

export interface EventPassListProps {
  deletePassesCart: (props: EventSlugs) => void;
  allPasses?: AllPassesCart;
  EventPassesFetcher: React.FC<EventPassesClientProps>;
}

export const EventPassList: React.FC<EventPassListProps> = ({
  deletePassesCart,
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
                onDelete={deletePassesCart}
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

export const EventPassListSkeleton: React.FC = () => {
  // Here you can customize how many skeleton items you want to render.
  const skeletonItemsCount = 3;

  return (
    <Accordion type="multiple">
      {Array.from({ length: skeletonItemsCount }).map((_, index) => (
        <div key={index}>
          <EventPassesSkeleton />
        </div>
      ))}
    </Accordion>
  );
};
