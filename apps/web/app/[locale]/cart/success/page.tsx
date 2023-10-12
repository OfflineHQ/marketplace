import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';
import { AppUser } from '@next/types';
import { StripeCheckoutSession } from '@payment/types';
import { FC } from 'react';

interface CartSectionProps {
  params: {
    locale: Locale;
  };
}

interface CartSectionContentProps {
  user: AppUser;
  locale: Locale;
  session: StripeCheckoutSession;
}

const CartSectionContent: FC<CartSectionContentProps> = ({
  user,
  locale,
  session,
}) => {
  return <div>CartSectionContent</div>;
};

export default async function CartPurchase({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  if (!isUserKycValidated(user)) redirect('/cart');

  return <div>Cart Purchase Successfull</div>;
  // let session = await getStripeActiveCheckoutSession();
  // if (!session) {
  //   const pendingOrders = await getEventPassPendingOrders({ locale });
  //   if (!pendingOrders?.length) redirect('/cart');
  //   session = await createStripeCheckoutSession({
  //     locale,
  //     eventPassPendingOrders: pendingOrders,
  //   });
  // }
  // if (!session || !user || !session.url)
  //   throw new Error('Failed to create checkout session');
  // redirect(session.url);
  // return <CartSectionContent user={user} locale={locale} session={session} />;
}
