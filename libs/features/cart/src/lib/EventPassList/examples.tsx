import type { AllPassesCart, EventCart } from '@features/cart-types';
import {
  event2Props,
  eventProps,
  passFamily,
  passPremium,
  passWeekend,
} from '@features/organizer/event/examples';
import { eventCartProps, eventPassesCart } from '../EventPasses/examples';
import { EventPassList, EventPassListSkeleton } from './EventPassList';

export const eventCart1Props: EventCart = eventCartProps;

export const eventCart2Props: EventCart = {
  ...event2Props,
  eventPasses: [passFamily, passWeekend, passPremium],
};

const eventPassesCart2: typeof eventPassesCart = [
  { eventPassId: passPremium.id, quantity: 3 },
  { eventPassId: passFamily.id, quantity: 2 },
];

export const allPassesEventsCart: AllPassesCart = {
  [eventProps?.organizer?.slug || 0]: {
    [eventCartProps.slug]: eventPassesCart,
  },
  [event2Props?.organizer?.slug || 0]: {
    [event2Props.slug]: eventPassesCart2,
  },
};

export const EventPassListExample = () => {
  return <EventPassList allPasses={allPassesEventsCart} />;
};

export const EventPassListLoadingExample = () => {
  return <EventPassListSkeleton />;
};
