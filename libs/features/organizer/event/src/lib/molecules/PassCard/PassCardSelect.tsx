'use client';
import { BoundedNumericStepper, ButtonSkeleton, Badge } from '@ui/components';
import { useTranslations } from 'next-intl';
import { usePassPurchaseStore } from '../../store/index';
import { useStore } from '@next/store';

import type { EventPass, EventSlugs } from '@features/organizer/event-types';

export interface PassCardSelectProps
  extends Omit<EventPass, 'description' | 'name' | 'passOptions' | 'nftImage'>,
    EventSlugs {}

export const PassCardSelect: React.FC<PassCardSelectProps> = ({
  eventPassPricing,
  eventPassOrderSums,
  organizerSlug,
  eventSlug,
  id,
  ...props
}) => {
  const t = useTranslations('Organizer.Event.PassPurchase.Pass');
  const store = useStore(usePassPurchaseStore, (state) => state);
  // directly set possible existing passes in the store at page load
  const getPassCart = usePassPurchaseStore((state) => state.getPassCart);

  const passCart = getPassCart({
    organizerSlug,
    eventSlug,
    eventPassId: id,
  });
  // here mean we are not yet in client side so wait for hydration and localstorage
  if (!store) {
    return <PassCardSelectSkeleton />;
  }
  const handleOnChange = (newNumTickets: number) => {
    store.updatePassCart({
      organizerSlug,
      eventSlug,
      pass: {
        id,
        amount: newNumTickets,
      },
    });
  };

  const totalReserved = eventPassOrderSums?.totalReserved ?? 0;
  const maxAvailableTickets =
    (eventPassPricing?.maxAmount || 0) - totalReserved;
  let maxVal = maxAvailableTickets;
  if (
    eventPassPricing?.maxAmountPerUser &&
    eventPassPricing.maxAmountPerUser <= maxAvailableTickets
  ) {
    maxVal = eventPassPricing.maxAmountPerUser;
  }
  return (
    <div className="flex gap-1">
      {maxVal <= 0 ? (
        <Badge variant="secondary">{t('sold-out')}</Badge>
      ) : (
        <BoundedNumericStepper
          onChange={handleOnChange}
          initialValue={passCart?.amount || 0}
          maxVal={maxVal}
        />
      )}
    </div>
  );
};

export const PassCardSelectSkeleton = () => (
  <div className="flex gap-1">
    <ButtonSkeleton />
  </div>
);
