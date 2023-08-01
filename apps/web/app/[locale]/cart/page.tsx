import { getCurrentUser } from '@web/lib/session';
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
      <UserCart EventPassesFetcher={EventPassesUser} locale={locale} />
    </Suspense>
  ) : (
    <NoUserCart EventPassesFetcher={EventPassesAnonymous} />
  );
}
