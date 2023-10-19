import {
  CartNav,
  NavSectionSkeleton,
  type CartNavProps,
} from '@features/appNav/ui';
import {
  getEventPassOrdersConfirmed,
  getEventPassPendingOrdersMinimal,
} from '@features/cart-api';
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
  let userPassConfirmedOrders: Awaited<
    ReturnType<typeof getEventPassOrdersConfirmed>
  >;
  let navProps: Pick<CartNavProps, 'ping'> = {};
  let numPendingOrders = 0;
  let numConfirmedOrders = 0;
  const user = await getCurrentUser();
  if (user) {
    userPassPendingOrders = await getEventPassPendingOrdersMinimal();
    userPassConfirmedOrders = await getEventPassOrdersConfirmed();
    if (userPassPendingOrders?.length) {
      numPendingOrders = userPassPendingOrders.reduce(
        (sum, order) => sum + order.quantity,
        0,
      );
      navProps = { ping: { number: numPendingOrders } };
    }
    if (userPassConfirmedOrders?.length) {
      numConfirmedOrders = userPassConfirmedOrders.reduce(
        (sum, order) => sum + order.quantity,
        0,
      );
      navProps = { ping: { isActive: true, number: numConfirmedOrders } };
    }
  }
  const t = await getTranslator(locale, 'AppNav.Cart');
  return (
    <CartNav
      text={t('text')}
      href={numConfirmedOrders ? '/cart/purchase' : '/cart'}
      helperText={
        numConfirmedOrders ? t('helper-text-purchase') : t('helper-text')
      }
      {...navProps}
    />
  );
}
