import { Event } from '@features/organizer/event-types';
import { EventDatesServer, type EventDatesServerProps } from '@next/date';
import {
  AspectRatio,
  AspectRatioSkeleton,
  Text,
  TextSkeleton,
} from '@ui/components';
import Image from 'next/image';
import React from 'react';
import {
  EventLocations,
  type EventLocationsProps,
} from '../../molecules/EventLocations/EventLocations';
import {
  EventOrganizerButton,
  EventOrganizerButtonSkeleton,
} from '../../molecules/EventOrganizerButton/EventOrganizerButton';

export interface EventHeroProps
  extends EventDatesServerProps,
    EventLocationsProps,
    Pick<
      Event,
      | 'heroImage'
      | 'heroImageClasses'
      | 'title'
      | 'organizer'
      | 'eventParameters'
    > {}

const layout = {
  grid: 'grid grid-cols-1 items-start gap-8 md:grid-cols-2',
  image: 'rounded-sm object-cover',
  textContainer: 'md:space-y-4 items-start h-full flex flex-col',
  text: 'mb-2 md:mb-4',
};

export const EventHero: React.FC<EventHeroProps> = ({
  heroImage,
  heroImageClasses,
  title,
  organizer,
  ...locationDatesProps
}) => {
  return (
    <div className={layout.grid}>
      <AspectRatio variant="widescreen">
        <Image
          src={heroImage?.url || '/image-placeholder.svg'}
          fill
          className={`${layout.image} ${heroImageClasses}`}
          alt={title}
        />
      </AspectRatio>
      <div className={layout.textContainer}>
        <div className="flex flex-col space-y-4">
          <Text variant="h2" className={layout.text}>
            {title}
          </Text>
          <div className={`${layout.text} flex items-center pb-2 md:pb-4`}>
            {organizer ? <EventOrganizerButton {...organizer} /> : null}
          </div>
          <EventDatesServer {...locationDatesProps} />
          <EventLocations {...locationDatesProps} />
        </div>
      </div>
    </div>
  );
};

export const EventHeroSkeleton: React.FC = () => {
  return (
    <div className={layout.grid}>
      <AspectRatioSkeleton variant="widescreen" className={`${layout.image}`} />
      <div className={layout.textContainer}>
        <div className="flex w-full flex-col space-y-8">
          <TextSkeleton variant="h1" />
          <EventOrganizerButtonSkeleton />
          <div className="w-full space-y-6 pb-6 md:pt-6">
            <TextSkeleton variant="h5" className="w-full md:w-3/4" />
            <TextSkeleton variant="h5" />
          </div>
        </div>
      </div>
    </div>
  );
};
