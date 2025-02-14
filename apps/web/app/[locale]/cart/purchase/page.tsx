import { deleteAllEventPassesCart } from '@features/cart-actions';
import { getPendingOrders } from '@features/cart-api';
import {
  createStripeCheckoutSession,
  getStripeActiveCheckoutSession,
} from '@features/payment-api';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';
import { redirect as nextRedirect } from 'next/navigation';
import { getErrorMessage } from '@utils';

interface CartSectionProps {
  params: {
    locale: Locale;
  };
}

export default async function CartPurchase({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  if (!user || !isUserKycValidated(user)) return redirect('/cart');
  let session;
  try {
    session = await getStripeActiveCheckoutSession();
  } catch (error) {
    if (getErrorMessage(error) === 'User has no email') {
      return redirect('/cart?reason=no-mail');
    }
  }
  // if no session means the user has pending orders that need to be transfered to the checkout session as confirmed
  if (!session) {
    const pendingOrders = await getPendingOrders();
    // if no pending orders means the user has no cart so redirect to the home page
    if (!pendingOrders?.length) return redirect('/');
    session = await createStripeCheckoutSession({
      locale,
      pendingOrders: pendingOrders,
    });
  }
  // if use have a session, make sur to clean all the pending orders and cache if user happen to have some
  else await deleteAllEventPassesCart();
  if (!session || !user || !session.url)
    throw new Error('Failed to create checkout session');
  nextRedirect(session.url);
}
