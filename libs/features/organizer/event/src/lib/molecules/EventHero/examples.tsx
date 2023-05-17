import { delay } from '@test-utils/functions';
import { type EventHeroProps } from './EventHero';

const organizer: EventHeroProps['organizer'] = {
  id: '1234',
  name: 'Test Organizer',
  description: 'This is a test organizer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const eventHeroProps: EventHeroProps = {
  heroImage: 'https://picsum.photos/seed/hero/800/450',
  title: 'Lorem ipsum dolor sit amet',
  date: '2021-10-10',
  location: '12 rue des champs, 75000 Paris',
  buyFunction: () => delay(1000),
  organizer,
  buyText: 'Buy tickets',
};
