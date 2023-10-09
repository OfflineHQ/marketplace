import type { EventPass, EventSlugs } from '@features/organizer/event-types';
//import { formatCurrency, useCurrency } from '@next/currency';
import { useStore } from '@next/store';
import { Text } from '@ui/components'; // Assuming TextSkeleton is imported from here
import { useFormatter, useTranslations } from 'next-intl';
import React from 'react';
import { usePassPurchaseStore } from '../../store/index';

export interface PassTotalProps extends EventSlugs {
  passesData: EventPass[];
}

export const PassTotal: React.FC<PassTotalProps> = ({
  passesData,
  organizerSlug,
  eventSlug,
}) => {
  const store = useStore(usePassPurchaseStore, (state) => state);
  //const { rates, isLoading } = useCurrency();
  const getPassesCartTotalPrice = usePassPurchaseStore(
    (state) => state.getPassesCartTotalPrice
  );
  const totalPrice = getPassesCartTotalPrice({
    organizerSlug,
    eventSlug,
    passesData,
  });
  const totalPasses = store?.getPassesCartTotalPasses({
    organizerSlug,
    eventSlug,
  });
  const format = useFormatter();
  const t = useTranslations();
  return (
    <div className="flex-col">
      <Text variant="small">
        {t('Organizer.Event.PassPurchase.Footer.total.pass-selected', {
          totalPasses,
        })}
      </Text>
      {/*isLoading ? (
        <TextSkeleton variant="h5" />
      ) : (
        <Text variant="h5">
          {t('Organizer.Event.PassPurchase.Footer.total.price', {
            totalPrice: formatCurrency(format, totalPrice, rates),
          })}
        </Text>
        )*/}
    </div>
  );
};
