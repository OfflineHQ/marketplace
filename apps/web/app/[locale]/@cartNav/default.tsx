import {
  CartNav,
  NavSectionSkeleton,
  type CartNavProps,
} from '@features/appNav/ui';
import {
  getEventPassOrdersConfirmed,
  getEventPassPendingOrdersMinimal,
} from '@features/cart/server';
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
  console.log('wait for cart nav');
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
        0
      );
      navProps = { ping: { number: numPendingOrders } };
    }
    if (userPassConfirmedOrders?.length) {
      numConfirmedOrders = userPassConfirmedOrders.reduce(
        (sum, order) => sum + order.quantity,
        0
      );
      navProps = { ping: { isActive: true, number: numConfirmedOrders } };
    }
  }
  // TODO get user cart if connected, otherwise get local storage cart from zustand.
  // const cart = await getCart(getUser);
  console.log('user from cart nav', user);
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

// import { CartNav, type CartNavProps } from '@features/appNav/ui';
// import { useTranslations } from 'next-intl';
// import { getCurrentUser } from '@next/next-auth/user';

// export default async function CartNavSection() {
//   const user = await getCurrentUser();
//   // TODO get user cart if connected, otherwise get local storage cart from zustand.
//   // const cart = await getCart(getUser);
//   return <CartNavSectionContent />;
// }

// function CartNavSectionContent(
//   props: Pick<CartNavProps, 'ping' | 'isLoading'>
// ) {
//   const t = useTranslations('AppNav.Cart');
//   return (
//     <CartNav
//       text={t('text')}
//       href="/cart"
//       helperText={t('helper-text')}
//       {...props}
//     />
//   );
// }
