import React from 'react';
import {
  AspectRatio,
  Text,
  AspectRatioSkeleton,
  TextSkeleton,
  ButtonSkeleton,
} from '@ui/components';
import Image from 'next/image';
import { Event } from '@features/organizer/event-types';
import {
  EventDates,
  type EventDatesProps,
} from '../../molecules/EventDates/EventDates';
import {
  EventLocations,
  type EventLocationsProps,
} from '../../molecules/EventLocations/EventLocations';
import { EventHeroButton, type EventHeroButtonProps } from './EventHeroButton';

import {
  EventOrganizerButton,
  EventOrganizerButtonSkeleton,
} from '../../molecules/EventOrganizerButton/EventOrganizerButton';

export interface EventHeroProps
  extends EventDatesProps,
    EventLocationsProps,
    EventHeroButtonProps,
    Pick<Event, 'heroImage' | 'title' | 'organizer'> {}

const layout = {
  grid: 'grid grid-cols-1 items-center gap-8 md:grid-cols-2',
  image: 'rounded-sm',
  textContainer: 'md:space-y-4 items-start h-full flex flex-col',
  text: 'mb-2 md:mb-4',
};

export const EventHero: React.FC<EventHeroProps> = ({
  heroImage,
  title,
  organizer,
  purchaseLink,
  purchaseText,
  ...locationDatesProps
}) => {
  return (
    <div className={layout.grid}>
      <AspectRatio variant="widescreen">
        <Image
          src={heroImage?.url || '/image-placeholder.svg'}
          fill
          className={layout.image}
          style={{ objectFit: 'cover' }}
          alt={title}
        />
      </AspectRatio>
      <div className={layout.textContainer}>
        <div className="hidden md:flex" />
        <div className="flex flex-col space-y-4">
          <Text variant="h2" className={layout.text}>
            {title}
          </Text>
          <div className={`${layout.text} flex items-center pb-2 md:pb-4`}>
            {organizer ? <EventOrganizerButton {...organizer} /> : null}
          </div>
          <EventDates {...locationDatesProps} />
          <EventLocations {...locationDatesProps} />
        </div>
        <div className="hidden w-full grow flex-col justify-end md:flex">
          <EventHeroButton {...{ purchaseLink, purchaseText }} />
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
        <div className="hidden md:flex" />
        <div className="flex w-full flex-col space-y-8">
          <TextSkeleton variant="h1" />
          <EventOrganizerButtonSkeleton />
          <div className="w-full space-y-6 pb-6 md:pt-6">
            <TextSkeleton variant="h5" className="w-full md:w-3/4" />
            <TextSkeleton variant="h5" />
          </div>
        </div>
        <div className="hidden w-full grow flex-col justify-end md:flex">
          <ButtonSkeleton className="w-full" />
        </div>
      </div>
    </div>
  );
};
