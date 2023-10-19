import { getEventPassPendingOrders } from '@features/cart-api';
import {
  createStripeCheckoutSession,
  getStripeActiveCheckoutSession,
} from '@features/payment-api';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';
import { redirect as nextRedirect } from 'next/navigation';

interface CartSectionProps {
  params: {
    locale: Locale;
  };
}

export default async function CartPurchase({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  if (!isUserKycValidated(user)) redirect('/cart');
  let session = await getStripeActiveCheckoutSession();
  if (!session) {
    const pendingOrders = await getEventPassPendingOrders();
    if (!pendingOrders?.length) redirect('/');
    session = await createStripeCheckoutSession({
      locale,
      eventPassPendingOrders: pendingOrders,
    });
  }
  console.log('session', session);
  if (!session || !user || !session.url)
    throw new Error('Failed to create checkout session');
  nextRedirect(session.url);
}
