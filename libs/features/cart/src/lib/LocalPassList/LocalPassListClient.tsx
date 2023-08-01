'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@next/store';
import type { UserPassPendingOrder } from '@features/cart/types';
import {
  EventPassList,
  EventPassListSkeleton,
  type EventPassListProps,
} from '../EventPassList/EventPassList';

export interface LocalPassListClientProps
  extends Pick<EventPassListProps, 'EventPassesFetcher'> {
  userPassPendingOrders?: UserPassPendingOrder[];
}

export const LocalPassListClient: React.FC<LocalPassListClientProps> = ({
  EventPassesFetcher,
  userPassPendingOrders,
}) => {
  const store = useStore(usePassPurchaseStore, (state) => state);
  const deletePassesCart = usePassPurchaseStore(
    (state) => state.deletePassesCart
  );
  const allPassesCart = store?.syncAllPassesCart({ userPassPendingOrders });
  console.log('userPassPendingOrders', userPassPendingOrders);
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
