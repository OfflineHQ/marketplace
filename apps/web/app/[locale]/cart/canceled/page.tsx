import { getOrdersFromStripeCheckoutSession } from '@features/cart-api';
import { CartCancelled } from '@features/cart/server';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';

interface CartCancelledPageProps {
  params: {
    locale: Locale;
  };
  searchParams: {
    session_id: string;
  };
}

export default async function CartCancelledPage({
  params: { locale },
  searchParams: { session_id },
}: CartCancelledPageProps) {
  if (!session_id) return redirect('/');
  const user = await getCurrentUser();
  if (!user || !isUserKycValidated(user)) return redirect('/');
  const passes = await getOrdersFromStripeCheckoutSession({
    user,
    stripeCheckoutSessionId: session_id,
  });
  return <CartCancelled passes={passes} />;
}
