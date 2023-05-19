import { eventHeroProps } from '../../molecules/EventHero/examples';
import {
  eventDetailsProps,
  long_description,
} from '../../molecules/EventDetails/examples';
import { type EventProps } from './Event';

export const eventProps: EventProps = {
  ...eventHeroProps,
  ...eventDetailsProps,
  description: long_description,
  buyFunction: () => null,
  buyText: 'Select passes',
};
