'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@next/store';
import {
  EventPassList,
  EventPassListSkeleton,
  type EventPassListProps,
} from '../EventPassList/EventPassList';

export type LocalPassListProps = Pick<EventPassListProps, 'EventPassesFetcher'>;

export const LocalPassListClient: React.FC<LocalPassListProps> = ({
  EventPassesFetcher,
}) => {
  const store = useStore(usePassPurchaseStore, (state) => state);
  const deletePassesCart = usePassPurchaseStore(
    (state) => state.deletePassesCart
  );
  const allPassesCart = store?.getAllPassesCart();
  return allPassesCart ? (
    /* TODO add image or animation if cart is empty */
    <EventPassList
      allPasses={allPassesCart}
      deletePassesCart={deletePassesCart}
      EventPassesFetcher={EventPassesFetcher}
    />
  ) : (
    <EventPassListSkeleton />
  );
};
