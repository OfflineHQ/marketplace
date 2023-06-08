import { type EventHeroProps } from './EventHero';
import { eventLocationsProps } from '../../molecules/EventLocations/examples';
import { eventDatesProps } from '../../molecules/EventDates/examples';

const organizer: EventHeroProps['organizer'] = {
  id: '1234',
  slug: 'test-organizer',
  name: 'Test Organizer',
  description: 'This is a test organizer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const eventHeroProps: EventHeroProps = {
  heroImage: 'https://picsum.photos/seed/hero/800/450',
  title: 'Lorem ipsum dolor sit amet',
  // followers: [],
  ...eventLocationsProps,
  ...eventDatesProps,
  organizer,
};
