'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import {
  EventPassList,
  type EventPassListProps,
} from '../EventPassList/EventPassList';

export type LocalPassListProps = Pick<EventPassListProps, 'EventPassesFetcher'>;

export const LocalPassListClient: React.FC<LocalPassListProps> = ({
  EventPassesFetcher,
}) => {
  const getAllPassesCart = usePassPurchaseStore(
    (state) => state.getAllPassesCart
  );
  const deletePasses = usePassPurchaseStore((state) => state.deletePasses);
  return (
    /* TODO add image or animation if cart is empty */
    <EventPassList
      allPasses={getAllPassesCart()}
      deletePasses={deletePasses}
      EventPassesFetcher={EventPassesFetcher}
    />
  );
};
