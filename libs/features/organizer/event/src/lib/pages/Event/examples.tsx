import { eventHeroProps } from '../../molecules/EventHero/examples';
import { eventDetailsProps } from '../../molecules/EventDetails/examples';
import { type EventProps } from './Event';

export const eventProps: EventProps = {
  ...eventHeroProps,
  ...eventDetailsProps,
  buyFunction: () => null,
  buyText: 'Select Passes',
};
