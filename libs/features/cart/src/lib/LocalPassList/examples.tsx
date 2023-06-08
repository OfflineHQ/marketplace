import { LocalPassList } from './LocalPassList';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { lotsOfPasses, eventProps } from '@features/organizer/event/examples';
import type { EventPassesServerProps } from '../EventPasses/EventPassesServer';
import { EventPasses } from '../EventPasses/EventPasses';
import { eventPassesProps } from '../EventPasses/examples';

export const FakeEventPassesServer = ({
  organizerSlug,
  eventSlug,
  ...props
}: EventPassesServerProps) => (
  <EventPasses event={eventPassesProps.event} {...props} />
);

export const LocalPassListExample = () => {
  const setPasses = usePassPurchaseStore((state) => state.setPasses);
  setPasses({
    organizerSlug: eventProps.organizer.slug,
    eventSlug: eventProps.slug,
    newPasses: eventPassesProps.passes,
  });
  return <LocalPassList EventPassServer={FakeEventPassesServer} />;
};
