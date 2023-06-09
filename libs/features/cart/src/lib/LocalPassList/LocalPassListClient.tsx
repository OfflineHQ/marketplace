'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@client/store';
import { EventPassList } from '../EventPassList/EventPassList';
import { EventPassesClient } from '../EventPasses/EventPassesClient';

export const LocalPassListClient: React.FC = () => {
  const passes = useStore(usePassPurchaseStore, (state) => state.passes);
  const deletePasses = usePassPurchaseStore((state) => state.deletePasses);
  return (
    /* TODO add image or animation if cart is empty */
    <EventPassList
      allPasses={passes}
      deletePasses={deletePasses}
      EventPassesFetcher={EventPassesClient}
    />
  );
};
