import { EventPassList } from './EventPassList';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import {
  eventProps,
  event2Props,
  passFamily,
  passWeekend,
  passPremium,
} from '@features/organizer/event/examples';
import type { EventPassesAnonymousProps } from '../EventPasses/EventPassesAnonymous';
import type { EventCart } from '@features/cart/types';
import { EventPasses, EventPassesSkeleton } from '../EventPasses/EventPasses';
import { eventCartProps, eventPassesCart } from '../EventPasses/examples';
import { useEffect } from 'react';

const eventCart2Props: EventCart = {
  ...event2Props,
  eventPasses: [passFamily, passWeekend, passPremium],
};

const eventPassesCart2: typeof eventPassesCart = [
  { id: passPremium.id, amount: 3 },
  { id: passFamily.id, amount: 2 },
];

const allPassesEventsCart: Record<string, Record<string, EventCart>> = {};
allPassesEventsCart[eventProps?.organizer?.slug || 0] = {};
allPassesEventsCart[eventCartProps?.organizer?.slug || 0][eventCartProps.slug] =
  eventCartProps;
allPassesEventsCart[event2Props?.organizer?.slug || 0] = {};
allPassesEventsCart[event2Props?.organizer?.slug || 0][event2Props.slug] =
  eventCart2Props;

export const FakeEventPassesFetcher = ({
  organizerSlug,
  eventSlug,
  ...props
}: EventPassesAnonymousProps) => (
  <EventPasses
    event={allPassesEventsCart[organizerSlug][eventSlug]}
    {...props}
  />
);

export const SetupPassesCartLocal = () => {
  const setPassesCart = usePassPurchaseStore((state) => state.setPassesCart);
  const allPasses = usePassPurchaseStore((state) => state.passes);
  const deletePassesCart = usePassPurchaseStore(
    (state) => state.deletePassesCart
  );
  useEffect(() => {
    setPassesCart({
      organizerSlug: eventProps?.organizer?.slug || '',
      eventSlug: eventProps.slug,
      newPasses: [eventPassesCart[0]],
    });
    setPassesCart({
      organizerSlug: event2Props?.organizer?.slug || '',
      eventSlug: event2Props.slug,
      newPasses: eventPassesCart2,
    });
  }, [setPassesCart]);
  return {
    allPasses,
    deletePassesCart,
  };
};

export const ResetPassesCartLocal = () => {
  const resetPasses = usePassPurchaseStore((state) => state.resetPasses);
  resetPasses();
};

export const EventPassListExample = () => {
  const { allPasses, deletePassesCart } = SetupPassesCartLocal();
  return (
    <EventPassList
      allPasses={allPasses}
      deletePassesCart={deletePassesCart}
      EventPassesFetcher={FakeEventPassesFetcher}
    />
  );
};

export const EventPassListLoadingExample = () => {
  const { allPasses, deletePassesCart } = SetupPassesCartLocal();
  return (
    <EventPassList
      allPasses={allPasses}
      deletePassesCart={deletePassesCart}
      EventPassesFetcher={EventPassesSkeleton}
    />
  );
};
