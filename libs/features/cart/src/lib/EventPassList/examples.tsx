import { EventPassList } from './EventPassList';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { eventProps, event2Props } from '@features/organizer/event/examples';
import type { EventPassesClientProps } from '../EventPasses/EventPassesClient';
import type { EventCart } from '@features/cart/types';
import { EventPasses, EventPassesSkeleton } from '../EventPasses/EventPasses';
import { eventPassesProps } from '../EventPasses/examples';
import { useEffect } from 'react';

const allPassesEventsCart: Record<string, Record<string, EventCart>> = {};
allPassesEventsCart[eventProps.organizer.slug] = {};
allPassesEventsCart[eventProps.organizer.slug][eventProps.slug] = eventProps;
allPassesEventsCart[event2Props.organizer.slug] = {};
allPassesEventsCart[event2Props.organizer.slug][event2Props.slug] = event2Props;

export const FakeEventPassesFetcher = ({
  organizerSlug,
  eventSlug,
  ...props
}: EventPassesClientProps) => (
  <EventPasses
    event={allPassesEventsCart[organizerSlug][eventSlug]}
    {...props}
  />
);

export const SetupPassesCartLocal = () => {
  const setPasses = usePassPurchaseStore((state) => state.setPasses);
  const allPasses = usePassPurchaseStore((state) => state.passes);
  const deletePasses = usePassPurchaseStore((state) => state.deletePasses);
  useEffect(() => {
    setPasses({
      organizerSlug: eventProps.organizer.slug,
      eventSlug: eventProps.slug,
      newPasses: eventPassesProps.passes,
    });
    setPasses({
      organizerSlug: event2Props.organizer.slug,
      eventSlug: event2Props.slug,
      newPasses: [eventPassesProps.passes[0]],
    });
  }, [setPasses]);
  return {
    allPasses,
    deletePasses,
  };
};

export const EventPassListExample = () => {
  const { allPasses, deletePasses } = SetupPassesCartLocal();
  return (
    <EventPassList
      allPasses={allPasses}
      deletePasses={deletePasses}
      EventPassesFetcher={FakeEventPassesFetcher}
    />
  );
};

export const EventPassListLoadingExample = () => {
  const { allPasses, deletePasses } = SetupPassesCartLocal();
  return (
    <EventPassList
      allPasses={allPasses}
      deletePasses={deletePasses}
      EventPassesFetcher={EventPassesSkeleton}
    />
  );
};
