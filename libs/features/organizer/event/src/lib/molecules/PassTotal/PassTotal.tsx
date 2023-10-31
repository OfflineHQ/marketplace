import { Money } from '@currency/types';
import { EventPassCart } from '@features/cart-types';
import type { EventPass } from '@features/organizer/event-types';
import { Currency_Enum } from '@gql/shared/types';
import { ConvertedCurrency } from '@next/currency';
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

  const money: Money = {
    amount: 0,
    currency:
      passesData[0].eventPassPricing?.priceCurrency || Currency_Enum.Eur,
  };
  for (const { quantity, eventPassId } of passesCart) {
    const pass = passesData.find(({ id }) => id === eventPassId);
    if (pass) {
      money.amount += quantity * (pass.eventPassPricing?.priceAmount || 0);
    }
  }
  const locale = useLocale();
  const t = await getTranslator(locale, 'Organizer.Event.PassPurchase.Footer');
  return (
    <div className="flex-col">
      <Text variant="small">
        {t('total.pass-selected', {
          totalPasses,
        })}
      </Text>
      <ConvertedCurrency
        variant="h5"
        translationKey="Organizer.Event.PassPurchase.Footer.total.price"
        {...money}
      />
    </div>
  );
};

export const PassTotalSkeleton: React.FC = () => (
  <div className="flex-col space-y-3 py-2">
    <TextSkeleton variant="small" />
    <TextSkeleton variant="h5" />
  </div>
);
