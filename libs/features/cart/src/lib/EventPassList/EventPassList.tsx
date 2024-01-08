import React, { Suspense } from 'react';

import { getEventWithPasses } from '@features/cart-api';
import { AllPassesCart } from '@features/cart-types';
import type { EventSlugs } from '@features/organizer/event-types';

import { Accordion } from '@ui/components';
import { useLocale } from 'next-intl';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from '../EventPasses/EventPasses';

export interface EventPassListProps
  extends Pick<EventPassesContentProps, 'noActions' | 'timeRemainingDeletion'> {
  allPasses?: AllPassesCart;
}

export interface EventPassesContentProps
  extends Pick<
      EventPassesProps,
      'passes' | 'noActions' | 'timeRemainingDeletion'
    >,
    EventSlugs {}

const EventPassListContent: React.FC<EventPassesContentProps> = async ({
  organizerSlug,
  eventSlug,
  passes,
  noActions,
  timeRemainingDeletion,
}) => {
  // const event = await GetEventWithPasses
  const locale = useLocale();
  const event = await getEventWithPasses({
    eventSlug,
    locale,
  });
  if (!event) return null;
  return (
    <EventPasses
      event={event}
      passes={passes}
      noActions={noActions}
      timeRemainingDeletion={timeRemainingDeletion}
    />
  );
};

export const EventPassList: React.FC<EventPassListProps> = ({
  allPasses,
  noActions,
  timeRemainingDeletion,
}) => {
  const organizersCart = Object.entries(allPasses || {}).map(
    ([organizerSlug, events]) => {
      return {
        organizerSlug,
        events,
      };
    },
  );
  const allEventsSlug = organizersCart.reduce((acc, { events }) => {
    Object.entries(events).forEach(([eventSlug, passes]) => {
      acc.push(eventSlug);
    });
    return acc;
  }, [] as string[]);
  return (
    <Accordion type="multiple" defaultValue={allEventsSlug}>
      {organizersCart.map(({ organizerSlug, events }, index) => (
        <div key={organizerSlug + index}>
          {Object.entries(events).map(([eventSlug, eventPasses], index) => (
            <div key={organizerSlug + eventSlug + index}>
              <Suspense fallback={<EventPassesSkeleton />}>
                <EventPassListContent
                  organizerSlug={organizerSlug}
                  eventSlug={eventSlug}
                  passes={eventPasses}
                  noActions={noActions}
                  timeRemainingDeletion={timeRemainingDeletion}
                />
              </Suspense>
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
    <Accordion type="multiple" className="w-full">
      {Array.from({ length: skeletonItemsCount }).map((_, index) => (
        <div key={index}>
          <EventPassesSkeleton />
        </div>
      ))}
    </Accordion>
  );
};
