// PassTotal.tsx
import React from 'react';
import { Text } from '@ui/components';
import type { EventPass, EventSlugs } from '../../types';
import { useFormatter, useTranslations } from 'next-intl';
import { formatCurrency } from '@next/currency';
import { usePassPurchaseStore } from '../../store/index';
import { useStore } from '@next/store';

export interface PassTotalProps extends EventSlugs {
  passesData: EventPass[];
}

export const PassTotal: React.FC<PassTotalProps> = ({
  passesData,
  organizerSlug,
  eventSlug,
}) => {
  const store = useStore(usePassPurchaseStore, (state) => state);
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
      <Text variant="h5">
        {t('Organizer.Event.PassPurchase.Footer.total.price', {
          totalPrice: formatCurrency(format, totalPrice),
        })}
      </Text>
    </div>
  );
};
