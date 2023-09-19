export const dynamic = 'force-dynamic';
import {
  EventPassListSkeleton,
  EventPassesAnonymous,
  EventPassesUser,
} from '@features/cart';
import { NoUserCart, UserCart } from '@features/cart/server';
import { SumsubButton } from '@features/kyc/server';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { getCurrentUser } from '@next/next-auth/user';
import { AppUser } from '@next/types';
import { Button } from '@ui/components';
import { Cart } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { FC, Suspense } from 'react';

interface CartSectionProps {
  params: {
    locale: Locale;
  };
}

interface CartSectionContentProps {
  user: AppUser | undefined;
  locale: Locale;
}

const CartSectionContent: FC<CartSectionContentProps> = ({ user, locale }) => {
  const t = useTranslations('Cart.UserCart');

  return user ? (
    <UserCart
      user={user}
      EventPassesFetcher={EventPassesUser}
      locale={locale}
      noCartImage="/empty-cart.svg"
    >
      {isUserKycValidated(user) ? (
        <Button>{t('finalize-button')}</Button>
      ) : (
        <SumsubButton
          locale={locale}
          confirmedText={t('finalize-button')}
          confirmedLink={{ href: '/cart/purchase' }}
          confirmedIcon={<Cart />}
        />
      )}
    </UserCart>
  ) : (
    <NoUserCart
      EventPassesFetcher={EventPassesAnonymous}
      noCartImage="/empty-cart.svg"
    />
  );
};

export default async function CartSection({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  return (
    <Suspense fallback={<EventPassListSkeleton />}>
      <CartSectionContent user={user} locale={locale} />
    </Suspense>
  );
}
