export const dynamic = 'force-dynamic';
import { EventPassesAnonymous, EventPassesUser } from '@features/cart';
import {
  NoUserCart,
  UserCart,
  UserCartProps,
  getEventPassOrdersConfirmed,
  getEventPassPendingOrders,
} from '@features/cart/server';
import { SumsubButton } from '@features/kyc/server';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { Link, redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';
import { AppUser } from '@next/types';
import { Button } from '@ui/components';
import { Cart } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface CartSectionProps {
  params: {
    locale: Locale;
  };
}

interface CartSectionContentProps
  extends Pick<UserCartProps, 'userPassPendingOrders'> {
  user: AppUser | undefined;
  locale: Locale;
}

const CartSectionContent: FC<CartSectionContentProps> = ({
  user,
  locale,
  userPassPendingOrders,
}) => {
  const t = useTranslations('Cart.UserCart');
  const isEmptyCart = !userPassPendingOrders?.length;
  return user ? (
    <UserCart
      user={user}
      EventPassesFetcher={EventPassesUser}
      locale={locale}
      userPassPendingOrders={userPassPendingOrders}
      noCartImage="/empty-cart.svg"
    >
      {isUserKycValidated(user) ? (
        <Link href={isEmptyCart ? '/cart' : '/cart/purchase'} legacyBehavior>
          <Button disabled={isEmptyCart} icon={<Cart />}>
            {t('finalize-button')}
          </Button>
        </Link>
      ) : (
        <SumsubButton
          locale={locale}
          confirmedText={
            isEmptyCart ? t('continue-button') : t('finalize-button')
          }
          confirmedLink={{ href: isEmptyCart ? '/cart' : '/cart/purchase' }}
          confirmedIcon={isEmptyCart ? undefined : <Cart />}
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
  if (!user) return <CartSectionContent user={user} locale={locale} />;
  const userPassPendingOrders = await getEventPassPendingOrders({ locale });
  const userPassConfirmedOrders = await getEventPassOrdersConfirmed();
  if (userPassConfirmedOrders?.length) {
    redirect('/cart/purchase');
  }
  return (
    <CartSectionContent
      user={user}
      locale={locale}
      userPassPendingOrders={userPassPendingOrders}
    />
  );
}
