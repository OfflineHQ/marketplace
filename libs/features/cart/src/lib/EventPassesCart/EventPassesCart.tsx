import { PassCache } from '@features/pass-cache';

import { AllPassesCart, UserPassPendingOrder } from '@features/cart-types';
import { Alert } from '@ui/components';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image, { StaticImageData } from 'next/image';
import { Suspense } from 'react';
import {
  EventPassList,
  EventPassListSkeleton,
} from '../EventPassList/EventPassList';
const passCache = new PassCache();

export interface EventPassesCartProps {
  noCartImage: string | StaticImageData;
  userPassPendingOrders?: UserPassPendingOrder[];
}

export const EventPassesCart: React.FC<EventPassesCartProps> = (props) => (
  <Suspense fallback={<EventPassListSkeleton />}>
    <EventPassesCartContent {...props} />
  </Suspense>
);

const EventPassesCartContent: React.FC<EventPassesCartProps> = async ({
  noCartImage,
  userPassPendingOrders,
}) => {
  const allPassesCart = userPassPendingOrders
    ? userPassPendingOrders.reduce((acc, order) => {
        const organizerSlug = order.eventPass?.event?.organizer?.slug;
        const eventSlug = order.eventPass?.event?.slug;
        if (organizerSlug && eventSlug) {
          if (!acc[organizerSlug]) {
            acc[organizerSlug] = {};
          }
          if (!acc[organizerSlug][eventSlug]) {
            acc[organizerSlug][eventSlug] = [];
          }
          acc[organizerSlug][eventSlug].push(order);
        }
        return acc;
      }, {} as AllPassesCart)
    : await passCache.getAllPassesCart();
  const isCartEmpty = Object.values(allPassesCart || {}).every((organizer) =>
    Object.values(organizer).every((event) => event.length === 0),
  );
  const locale = useLocale();
  const t = await getTranslations({ locale, namespace: 'Cart.List' });
  return !isCartEmpty && allPassesCart ? (
    <EventPassList allPasses={allPassesCart} />
  ) : (
    <div className="m-5 flex flex-col items-center">
      <Alert variant="info" className="w-max">
        {t('no-cart')}
      </Alert>
      <div className="relative h-80 w-80 grow">
        <Image fill src={noCartImage} alt={t('no-cart')} />
      </div>
    </div>
  );
};
