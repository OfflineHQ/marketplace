import {
  CartNav,
  NavSectionSkeleton,
  type CartNavProps,
} from '@features/app-nav';
import { getEventPassPendingOrdersMinimal } from '@features/cart-api';
import { getCurrentUser } from '@next/next-auth/user';
import { Suspense } from 'react';

import { getTranslator } from 'next-intl/server';

interface CartNavSectionProps {
  params: {
    locale: string;
  };
}

export default async function CartNavSection({
  params: { locale },
}: CartNavSectionProps) {
  return (
    <Suspense fallback={<NavSectionSkeleton />}>
      <CartNavSectionContent locale={locale} />
    </Suspense>
  );
}

async function CartNavSectionContent({ locale }: { locale: string }) {
  let userPassPendingOrders: Awaited<
    ReturnType<typeof getEventPassPendingOrdersMinimal>
  >;
  let navProps: Pick<CartNavProps, 'ping'> = {};
  let numPendingOrders = 0;
  const user = await getCurrentUser();
  if (user) {
    userPassPendingOrders = await getEventPassPendingOrdersMinimal();
    if (userPassPendingOrders?.length) {
      numPendingOrders = userPassPendingOrders.reduce(
        (sum, order) => sum + order.quantity,
        0,
      );
      navProps = { ping: { number: numPendingOrders } };
    }
  }
  const t = await getTranslator(locale, 'AppNav.Cart');
  return (
    <CartNav
      text={t('text')}
      href={'/cart'} //TODO Replace with numPendingOrders instead of delete ?
      helperText={t('helper-text')}
      {...navProps}
    />
  );
}
