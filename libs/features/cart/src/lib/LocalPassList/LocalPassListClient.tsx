'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import type { UserPassPendingOrder } from '@features/cart-types';
import type { AllPassesCart } from '@features/organizer/event-types';
import {
  EventPassList,
  EventPassListSkeleton,
  type EventPassListProps,
} from '../EventPassList/EventPassList';
import { useState, useEffect } from 'react';

export interface LocalPassListClientProps
  extends Pick<EventPassListProps, 'EventPassesFetcher'> {
  userPassPendingOrders?: UserPassPendingOrder[];
}

export const LocalPassListClient: React.FC<LocalPassListClientProps> = ({
  EventPassesFetcher,
  userPassPendingOrders,
}) => {
  const syncAllPassesCart = usePassPurchaseStore(
    (state) => state.syncAllPassesCart
  );
  const deletePassesCart = usePassPurchaseStore(
    (state) => state.deletePassesCart
  );
  const [allPassesCart, setAllPassesCart] = useState<AllPassesCart | null>(
    null
  );
  const deletePassesCartAndUpdateStore = (props: any) => {
    deletePassesCart(props);
    // here userPassPendingOrders might be not updated in time so does not reflect the latest state
    const _allPassesCart = syncAllPassesCart({});
    setAllPassesCart(_allPassesCart);
  };
  useEffect(() => {
    setAllPassesCart(syncAllPassesCart({ userPassPendingOrders }) || {});
  }, [userPassPendingOrders]);

  // const allPassesCart = store?.syncAllPassesCart({ userPassPendingOrders });
  return allPassesCart ? (
    /* TODO add image or animation if cart is empty */
    <EventPassList
      allPasses={allPassesCart}
      deletePassesCart={deletePassesCartAndUpdateStore}
      EventPassesFetcher={EventPassesFetcher}
    />
  ) : (
    <EventPassListSkeleton />
  );
};
