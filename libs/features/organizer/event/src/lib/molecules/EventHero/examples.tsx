import {
  event2LocationsProps,
  eventDateLocation1,
  eventDateLocation2,
  eventDateLocation3,
  eventLocationsProps,
} from '../../molecules/EventLocations/examples';
import {
  eventParametersSaleEnded,
  eventParametersSaleOngoing,
} from '../EventSaleDates/examples';
import { type EventHeroProps } from './EventHero';

export const eventDatesProps = {
  eventDateLocations: [eventDateLocation1, eventDateLocation2],
  detailed: false,
};

export const event2DatesProps = {
  eventDateLocations: [eventDateLocation3],
  detailed: false,
};

const organizer: EventHeroProps['organizer'] = {
  id: '1234',
  slug: 'test-organizer',
  name: 'Test Organizer',
  image: {
    url: 'https://picsum.photos/id/424/200/200',
  },
};

const organizer2: EventHeroProps['organizer'] = {
  id: '43411',
  slug: 'test-organizer-2',
  name: 'Test Organizer 2',
  image: {
    url: 'https://picsum.photos/id/524/200/200',
  },
};

export const eventHeroProps: EventHeroProps = {
  heroImage: {
    url: 'https://picsum.photos/seed/hero/800/450',
  },
  title: 'Lorem ipsum dolor sit amet',
  // followers: [],
  ...eventLocationsProps,
  ...eventDatesProps,
  organizer,
  eventParameters: eventParametersSaleEnded,
};

export const event2HeroProps: EventHeroProps = {
  heroImage: {
    url: 'https://picsum.photos/id/223/900/900',
  },
  title: 'World cup 2023',
  ...event2LocationsProps,
  ...event2DatesProps,
  organizer: organizer2,
  eventParameters: eventParametersSaleOngoing,
};
