import { LocalPassList } from './LocalPassList';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { lotsOfPasses } from '@features/organizer/event/examples';

export const LocalPassListExample = () => {
  const setPasses = usePassPurchaseStore((state) => state.setPasses);
  setPasses('dummy_organizer', 'dummy_event', lotsOfPasses);
  return <LocalPassList />;
};
