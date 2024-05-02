import type { EventPass } from '@features/organizer/event-types';
import React from 'react';
import {
  PassCard,
  PassCardProps,
  PassCardSkeleton,
} from '../../molecules/PassCard/PassCard';

export interface PassListProps
  extends Pick<
    PassCardProps,
    'eventSlug' | 'organizerSlug' | 'hasConfirmedPasses' | 'saleStatus'
  > {
  className?: string;
  passes: EventPass[];
}

export const PassList: React.FC<PassListProps> = ({
  passes,
  className,
  eventSlug,
  organizerSlug,
  hasConfirmedPasses,
  saleStatus,
}) => (
  <div
    className={`grid auto-rows-min grid-cols-1 gap-4 px-1 pb-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}
  >
    {passes.map(({ id, ...passProps }) => (
      <PassCard
        {...passProps}
        id={id}
        key={`${id}-${eventSlug}-${organizerSlug}`}
        eventSlug={eventSlug}
        organizerSlug={organizerSlug}
        hasConfirmedPasses={hasConfirmedPasses}
        saleStatus={saleStatus}
      />
    ))}
  </div>
);

export const PassListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <PassCardSkeleton key={index} />
    ))}
  </div>
);
