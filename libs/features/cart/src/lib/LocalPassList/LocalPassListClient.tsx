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
import Image, { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import { Alert } from '@ui/components';

export interface LocalPassListClientProps
  extends Pick<EventPassListProps, 'EventPassesFetcher'> {
  userPassPendingOrders?: UserPassPendingOrder[];
  noCartImage: string | StaticImageData;
}

export const LocalPassListClient: React.FC<LocalPassListClientProps> = ({
  EventPassesFetcher,
  userPassPendingOrders,
  noCartImage,
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

  const isCartEmpty = Object.values(allPassesCart || {}).every((organizer) =>
    Object.values(organizer).every((event) => event.length === 0)
  );
  const t = useTranslations('Cart.List');
  return allPassesCart ? (
    !isCartEmpty ? (
      <EventPassList
        allPasses={allPassesCart}
        deletePassesCart={deletePassesCartAndUpdateStore}
        EventPassesFetcher={EventPassesFetcher}
      />
    ) : (
      <div className="m-5 flex flex-col items-center">
        <Alert variant="info" className="w-max">
          {t('no-cart')}
        </Alert>
        <div className="relative h-80 w-80 grow">
          <Image fill src={noCartImage} alt={t('no-cart')} />
        </div>
      </div>
    )
  ) : (
    <EventPassListSkeleton />
  );
};
