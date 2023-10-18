import type { EventPass, EventPassCart } from '@features/organizer/event-types';
import { Text, TextSkeleton } from '@ui/components';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import React, { Suspense } from 'react';

export interface PassTotalProps {
  passesData: EventPass[];
  passesCart: EventPassCart[];
}

export const PassTotal: React.FC<PassTotalProps> = (props) => {
  return (
    <Suspense fallback={<PassTotalSkeleton />}>
      <PassTotalContent {...props} />
    </Suspense>
  );
};

export const PassTotalContent: React.FC<PassTotalProps> = async ({
  passesData,
  passesCart,
}) => {
  const totalPasses =
    passesCart?.reduce((acc, { quantity }) => acc + quantity, 0) || 0;

  const locale = useLocale();
  const t = await getTranslator(locale, 'Organizer.Event.PassPurchase.Footer');
  return (
    <div className="flex-col">
      <Text variant="small">
        {t('total.pass-selected', {
          totalPasses,
        })}
      </Text>
      {/* <ConvertedCurrency variant="h5" currency={} /> */}
      {/* <Text variant="h5">
        {t('total.price', {
          totalPrice: formatCurrency(format, totalPrice, rates),
        })}
      </Text> */}
    </div>
  );
};

export const PassTotalSkeleton: React.FC = () => (
  <div className="flex-col">
    <TextSkeleton variant="small" />
    <TextSkeleton variant="h5" />
  </div>
);
