import { LocalPassList } from './LocalPassList';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { eventProps, event2Props } from '@features/organizer/event/examples';
import type { EventPassesServerProps } from '../EventPasses/EventPassesServer';
import type { EventCart } from '@features/cart/types';
import { EventPasses, EventPassesSkeleton } from '../EventPasses/EventPasses';
import { eventPassesProps } from '../EventPasses/examples';

const allPassesEventsCart: Record<string, Record<string, EventCart>> = {};
allPassesEventsCart[eventProps.organizer.slug] = {};
allPassesEventsCart[eventProps.organizer.slug][eventProps.slug] = eventProps;
allPassesEventsCart[event2Props.organizer.slug] = {};
allPassesEventsCart[event2Props.organizer.slug][event2Props.slug] = event2Props;

export const FakeEventPassesServer = ({
  organizerSlug,
  eventSlug,
  ...props
}: EventPassesServerProps) => (
  <EventPasses
    event={allPassesEventsCart[organizerSlug][eventSlug]}
    {...props}
  />
);

export const SetupPassesCartLocal = () => {
  const setPasses = usePassPurchaseStore((state) => state.setPasses);
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
};

export const LocalPassListExample = () => {
  SetupPassesCartLocal();
  return <LocalPassList EventPassServer={FakeEventPassesServer} />;
};

export const FakeEventPassesServerLoading = ({
  organizerSlug,
  eventSlug,
  ...props
}: EventPassesServerProps) => <EventPassesSkeleton />;

export const LocalPassListLoadingExample = () => {
  SetupPassesCartLocal();
  return <LocalPassList EventPassServer={FakeEventPassesServerLoading} />;
};
