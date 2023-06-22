import React from 'react';
import {
  AspectRatio,
  Text,
  AspectRatioSkeleton,
  TextSkeleton,
} from '@ui/components';
import Image from 'next/image';
import { Event } from '../../types';
import {
  EventDates,
  type EventDatesProps,
} from '../../molecules/EventDates/EventDates';
import {
  EventLocations,
  type EventLocationsProps,
} from '../../molecules/EventLocations/EventLocations';

export interface EventHeroProps
  extends EventDatesProps,
    EventLocationsProps,
    Pick<Event, 'heroImage' | 'title' | 'organizer'> {}

const layout = {
  grid: 'grid grid-cols-1 items-center gap-8 md:grid-cols-2',
  image: 'rounded-sm',
  textContainer: 'space-y-4 items-start',
  text: 'mb-4',
  button: 'self-start',
};

export const EventHero: React.FC<EventHeroProps> = ({
  heroImage,
  title,
  organizer,
  ...locationDatesProps
}) => {
  return (
    <div className={layout.grid}>
      <AspectRatio variant="widescreen">
        <Image
          src={heroImage.url}
          fill
          className={layout.image}
          style={{ objectFit: 'cover' }}
          alt={title}
        />
      </AspectRatio>
      <div className={layout.textContainer}>
        <Text variant="h2" className={layout.text}>
          {title}
        </Text>
        <Text variant="h4" className={`${layout.text} flex`}>
          <div className="font-medium">By</div>
          <div className="ml-1 tracking-wider">{organizer?.name}</div>
        </Text>
        <EventDates {...locationDatesProps} />
        <EventLocations {...locationDatesProps} />
      </div>
    </div>
  );
};

export const EventHeroSkeleton: React.FC = () => {
  return (
    <div className={layout.grid}>
      <AspectRatioSkeleton variant="widescreen" className={`${layout.image}`} />
      <div className="space-y-4">
        <TextSkeleton variant="h1" />
        <TextSkeleton variant="h3" />
        <TextSkeleton variant="p" />
      </div>
    </div>
  );
};
