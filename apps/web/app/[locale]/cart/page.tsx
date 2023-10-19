export const dynamic = 'force-dynamic';
import {
  getEventPassOrdersConfirmed,
  getEventPassPendingOrders,
} from '@features/cart-api';
import {
  NoUserCart,
  UserCart,
  type UserCartProps,
} from '@features/cart/server';
import { SumsubButton } from '@features/kyc/server';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { Link } from '@next/navigation';
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
    <NoUserCart noCartImage="/empty-cart.svg" />
  );
};

export default async function CartSection({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  if (!user) return <CartSectionContent user={user} locale={locale} />;
  // TODO: check if user has pending orders, if he have none check for the cache
  // if get passes in cache, transfer it to pending orders if the event sale is not finished and then delete the cache.
  // Do this in the pass-cache lib, execute this also in the event purchase page.
  const userPassPendingOrders = await getEventPassPendingOrders();
  const userPassConfirmedOrders = await getEventPassOrdersConfirmed();
  // if (userPassConfirmedOrders?.length) {
  //   redirect('/cart/purchase');
  // }
  return (
    <CartSectionContent
      user={user}
      locale={locale}
      userPassPendingOrders={userPassPendingOrders}
    />
  );
}
