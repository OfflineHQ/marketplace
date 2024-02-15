export const dynamic = 'force-dynamic';
import {
  getAllPassesCart,
  getOrdersConfirmed,
  getPendingOrders,
} from '@features/cart-api';
import {
  NoUserCart,
  UserCart,
  type UserCartProps,
} from '@features/cart/server';
import { SumsubButton } from '@features/kyc/server';
import { PassCache } from '@features/pass-cache';
import { isUserKycValidated } from '@kyc/common';
import { Link, redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';
import { AppUser } from '@next/types';
import { Button } from '@ui/components';
import { Cart } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const passCache = new PassCache();

interface CartSectionProps {
  params: {
    locale: Locale;
  };
  searchParams?: {
    reason?: string;
  };
}

interface CartSectionContentProps
  extends Pick<UserCartProps, 'userPassPendingOrders' | 'allPassesCart'> {
  user: AppUser | undefined;
  reason?: string;
}

const CartSectionContent: FC<CartSectionContentProps> = ({
  user,
  userPassPendingOrders,
  allPassesCart,
  reason,
}) => {
  const t = useTranslations('Cart.UserCart');
  const isEmptyCart = !userPassPendingOrders?.length;

  return user ? (
    <UserCart
      userPassPendingOrders={userPassPendingOrders}
      allPassesCart={allPassesCart}
      noCartImage="/empty-cart.svg"
      reason={reason}
    >
      {isUserKycValidated(user) ? (
        <Link href={isEmptyCart ? '/cart' : '/cart/purchase'} legacyBehavior>
          <Button
            disabled={isEmptyCart}
            icon={<Cart />}
            block
            className="w-full md:w-1/6"
          >
            {t('finalize-button')}
          </Button>
        </Link>
      ) : (
        <SumsubButton
          confirmedText={
            isEmptyCart ? t('continue-button') : t('finalize-button')
          }
          confirmedLink={{ href: isEmptyCart ? '/cart' : '/cart/purchase' }}
          confirmedIcon={isEmptyCart ? undefined : <Cart />}
        />
      )}
    </UserCart>
  ) : (
    <NoUserCart noCartImage="/empty-cart.svg" allPassesCart={allPassesCart} />
  );
};

export default async function CartSection({
  params: { locale },
  searchParams: { reason } = { reason: undefined },
}: CartSectionProps) {
  const user = await getCurrentUser();
  if (!user) {
    const allPassesCart = await getAllPassesCart(passCache);
    return (
      <CartSectionContent
        user={user}
        allPassesCart={allPassesCart}
        reason={reason}
      />
    );
  }
  let userPassPendingOrders = await getPendingOrders();
  const userPassConfirmedOrders = await getOrdersConfirmed();
  // if user has confirmed orders and kyc validated, redirect to purchase page
  if (userPassConfirmedOrders?.length && isUserKycValidated(user)) {
    redirect('/cart/purchase');
  }
  // check if user has pending orders, if he have none check for the cache
  // if get passes in cache, transfer it to pending orders if the event sale is not finished and then delete the cache.
  else if (!userPassPendingOrders?.length) {
    const res = await passCache.transferPassesCartToDb();
    if (res) userPassPendingOrders = res;
  }

  const allPassesCart = await getAllPassesCart(
    passCache,
    userPassPendingOrders,
  );

  return (
    <CartSectionContent
      user={user}
      userPassPendingOrders={userPassPendingOrders}
      allPassesCart={allPassesCart}
      reason={reason}
    />
  );
}
