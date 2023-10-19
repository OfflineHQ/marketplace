import { PassCache } from '@features/pass-cache';

import { Alert } from '@ui/components';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import Image, { StaticImageData } from 'next/image';
import { Suspense } from 'react';
import {
  EventPassList,
  EventPassListSkeleton,
} from '../EventPassList/EventPassList';
const passeCache = new PassCache();

export interface LocalPassListProps {
  noCartImage: string | StaticImageData;
}

export const LocalPassList: React.FC<LocalPassListProps> = ({
  noCartImage,
}) => (
  <Suspense fallback={<EventPassListSkeleton />}>
    <LocalPassListContent noCartImage={noCartImage} />
  </Suspense>
);

const LocalPassListContent: React.FC<LocalPassListProps> = async ({
  noCartImage,
}) => {
  const allPassesCart = await passeCache.getAllPassesCart();
  console.log({ allPassesCart });
  const isCartEmpty = Object.values(allPassesCart || {}).every((organizer) =>
    Object.values(organizer).every((event) => event.length === 0),
  );
  const locale = useLocale();
  const t = await getTranslator(locale, 'Cart.List');
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
