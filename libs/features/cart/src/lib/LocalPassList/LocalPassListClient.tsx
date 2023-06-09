'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@client/store';
import {
  EventPassList,
  type EventPassListProps,
} from '../EventPassList/EventPassList';

export type LocalPassListProps = Pick<EventPassListProps, 'EventPassesFetcher'>;

export const LocalPassListClient: React.FC<LocalPassListProps> = ({
  EventPassesFetcher,
}) => {
  const passes = useStore(usePassPurchaseStore, (state) => state.passes);
  const deletePasses = usePassPurchaseStore((state) => state.deletePasses);
  return (
    /* TODO add image or animation if cart is empty */
    <EventPassList
      allPasses={passes}
      deletePasses={deletePasses}
      EventPassesFetcher={EventPassesFetcher}
    />
  );
};
