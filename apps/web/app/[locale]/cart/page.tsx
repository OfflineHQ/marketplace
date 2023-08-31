import { getCurrentUser } from '@next/next-auth/user';
import { NoUserCart, UserCart } from '@features/cart/server';
import {
  EventPassesAnonymous,
  EventPassesUser,
  EventPassListSkeleton,
} from '@features/cart';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface CartSectionProps {
  params: {
    locale: string;
  };
}

export default async function CartSection({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  return user ? (
    <Suspense fallback={<EventPassListSkeleton />}>
      <UserCart
        EventPassesFetcher={EventPassesUser}
        locale={locale}
        noCartImage="/empty-cart.svg"
      />
    </Suspense>
  ) : (
    <NoUserCart
      EventPassesFetcher={EventPassesAnonymous}
      noCartImage="/empty-cart.svg"
    />
  );
}
