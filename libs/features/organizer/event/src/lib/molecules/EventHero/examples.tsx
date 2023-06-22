import { type EventHeroProps } from './EventHero';
import {
  eventLocationsProps,
  event2LocationsProps,
} from '../../molecules/EventLocations/examples';
import {
  eventDatesProps,
  event2DatesProps,
} from '../../molecules/EventDates/examples';

const organizer: EventHeroProps['organizer'] = {
  id: '1234',
  slug: 'test-organizer',
  name: 'Test Organizer',
};

const organizer2: EventHeroProps['organizer'] = {
  id: '43411',
  slug: 'test-organizer-2',
  name: 'Test Organizer 2',
};

export const eventHeroProps: EventHeroProps = {
  heroImage: {
    url: 'https://picsum.photos/seed/hero/800/450',
  },
  title: 'Lorem ipsum dolor sit amet',
  // followers: [],
  ...eventLocationsProps,
  ...eventDatesProps,
  purchaseLink: { href: { pathname: '/dummy' } },
  purchaseText: 'Select passes',
  organizer,
};

export const event2HeroProps: EventHeroProps = {
  heroImage: {
    url: 'https://picsum.photos/id/223/900/900',
  },
  title: 'World cup 2023',
  ...event2LocationsProps,
  ...event2DatesProps,
  purchaseLink: { href: { pathname: '/dummy' } },
  purchaseText: 'Select passes',
  organizer: organizer2,
};
