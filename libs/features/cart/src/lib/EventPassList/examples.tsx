import type { EventCart } from '@features/cart-types';
import {
  event2Props,
  eventProps,
  passFamily,
  passPremium,
  passWeekend,
} from '@features/organizer/event/examples';
import { eventCartProps, eventPassesCart } from '../EventPasses/examples';
import { EventPassList } from './EventPassList';

const eventCart2Props: EventCart = {
  ...event2Props,
  eventPasses: [passFamily, passWeekend, passPremium],
};

const eventPassesCart2: typeof eventPassesCart = [
  { eventPassId: passPremium.id, quantity: 3 },
  { eventPassId: passFamily.id, quantity: 2 },
];

const allPassesEventsCart: Record<string, Record<string, EventCart>> = {};
allPassesEventsCart[eventProps?.organizer?.slug || 0] = {};
allPassesEventsCart[eventCartProps?.organizer?.slug || 0][eventCartProps.slug] =
  eventCartProps;
allPassesEventsCart[event2Props?.organizer?.slug || 0] = {};
allPassesEventsCart[event2Props?.organizer?.slug || 0][event2Props.slug] =
  eventCart2Props;

export const EventPassListExample = () => {
  return <EventPassList allPasses={allPassesEventsCart} />;
};

export const EventPassListLoadingExample = () => {
  return <EventPassList allPasses={allPassesEventsCart} />;
};
