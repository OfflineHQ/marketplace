import { AllPassesCart, UserPassPendingOrder } from '@features/cart-types';
import { Alert, AlertTitle } from '@ui/components';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image, { StaticImageData } from 'next/image';
import { Suspense } from 'react';
import {
  EventPassList,
  EventPassListSkeleton,
} from '../EventPassList/EventPassList';

export interface EventPassesCartProps {
  noCartImage: string | StaticImageData;
  allPassesCart: AllPassesCart | null;
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
  allPassesCart,
}) => {
  console.log('allPassesCart', allPassesCart);

  const isCartEmpty = Object.values(allPassesCart || {}).every((organizer) =>
    Object.values(organizer).every((event) => event.length === 0),
  );
  const locale = useLocale();
  const t = await getTranslations({ locale, namespace: 'Cart.List' });
  return !isCartEmpty && allPassesCart ? (
    <EventPassList
      allPasses={allPassesCart}
      timeRemainingDeletion={!!userPassPendingOrders?.length}
    />
  ) : (
    <div className="mx-5 flex flex-col items-center md:m-5">
      <Alert variant="info" className="md:w-max">
        <AlertTitle>{t('no-cart')}</AlertTitle>
      </Alert>
      <div className="size-80 relative grow">
        <Image fill src={noCartImage} alt={t('no-cart')} />
      </div>
    </div>
  );
};
