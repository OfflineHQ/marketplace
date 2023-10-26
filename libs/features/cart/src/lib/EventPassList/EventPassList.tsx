import React, { Suspense } from 'react';

import { getEventWithPasses } from '@features/cart-api';
import type {
  AllPassesCart,
  EventSlugs,
} from '@features/organizer/event-types';
import { Accordion } from '@ui/components';
import { useLocale } from 'next-intl';
import {
  EventPasses,
  EventPassesSkeleton,
  type EventPassesProps,
} from '../EventPasses/EventPasses';

export interface EventPassListProps
  extends Pick<EventPassesContentProps, 'noActions'> {
  allPasses?: AllPassesCart;
}

export interface EventPassesContentProps
  extends Pick<EventPassesProps, 'passes' | 'noActions'>,
    EventSlugs {}

const EventPassListContent: React.FC<EventPassesContentProps> = async ({
  organizerSlug,
  eventSlug,
  passes,
  noActions,
}) => {
  // const event = await GetEventWithPasses
  const locale = useLocale();
  const event = await getEventWithPasses({ eventSlug, locale });
  if (!event) return null;
  return <EventPasses event={event} passes={passes} noActions={noActions} />;
};

export const EventPassList: React.FC<EventPassListProps> = ({
  allPasses,
  noActions,
}) => {
  return (
    <Accordion type="multiple">
      {Object.entries(allPasses || {}).map(([organizerSlug, events], index) => (
        <div key={organizerSlug + index}>
          {Object.entries(events).map(([eventSlug, eventPasses], index) => (
            <div key={organizerSlug + eventSlug + index}>
              <Suspense fallback={<EventPassesSkeleton />}>
                <EventPassListContent
                  organizerSlug={organizerSlug}
                  eventSlug={eventSlug}
                  passes={eventPasses}
                  noActions={noActions}
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
