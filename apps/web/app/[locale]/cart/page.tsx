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
import { PassCache } from '@features/pass-cache';
import { Locale } from '@gql/shared/types';
import { Posthog } from '@insight/server';
import { FeatureFlagsEnum } from '@insight/types';
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
}

interface CartSectionContentProps
  extends Pick<UserCartProps, 'userPassPendingOrders'> {
  user: AppUser | undefined;
  locale: Locale;
  kycFlag?: boolean;
}

const CartSectionContent: FC<CartSectionContentProps> = ({
  user,
  locale,
  userPassPendingOrders,
  kycFlag,
}) => {
  const t = useTranslations('Cart.UserCart');
  const isEmptyCart = !userPassPendingOrders?.length;
  return user ? (
    <UserCart
      userPassPendingOrders={userPassPendingOrders}
      noCartImage="/empty-cart.svg"
    >
      {!kycFlag || isUserKycValidated(user) ? (
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
  const kycFlag = await Posthog.getInstance().getFeatureFlag(
    FeatureFlagsEnum.KYC,
    user.address,
  );
  let userPassPendingOrders = await getEventPassPendingOrders();
  const userPassConfirmedOrders = await getEventPassOrdersConfirmed();
  // if user has confirmed orders and kyc validated, redirect to purchase page
  // if kycflag is false, redirect to purchase page because doesn't have kyc
  if (
    userPassConfirmedOrders?.length &&
    (!kycFlag || isUserKycValidated(user))
  ) {
    redirect('/cart/purchase');
  }
  // check if user has pending orders, if he have none check for the cache
  // if get passes in cache, transfer it to pending orders if the event sale is not finished and then delete the cache.
  else if (!userPassPendingOrders?.length) {
    const res = await passCache.transferPassesCartToDb();
    if (res) userPassPendingOrders = res;
  }

  return (
    <CartSectionContent
      kycFlag={kycFlag}
      user={user}
      locale={locale}
      userPassPendingOrders={userPassPendingOrders}
    />
  );
}
