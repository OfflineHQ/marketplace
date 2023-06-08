import { LocalPassList } from './LocalPassList';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { lotsOfPasses } from '@features/organizer/event/examples';
import EventPassesServer from '../EventPasses/EventPassesServer';

export const LocalPassListExample = () => {
  const setPasses = usePassPurchaseStore((state) => state.setPasses);
  setPasses({
    organizerSlug: 'dummy_organizer',
    eventSlug: 'dummy_event',
    newPasses: lotsOfPasses,
  });
  return <LocalPassList EventPassServer={EventPassesServer} />;
};
