import { getEventPassOrdersFromStripeCheckoutSession } from '@features/cart-api';
import { CartSuccessful } from '@features/cart/server';
import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';

interface CartSuccessfulPageProps {
  params: {
    locale: Locale;
  };
  searchParams: {
    session_id: string;
  };
}

export default async function CartSuccessfulPage({
  params: { locale },
  searchParams: { session_id },
}: CartSuccessfulPageProps) {
  if (!session_id) return redirect('/');
  const user = await getCurrentUser();
  if (!user || !isUserKycValidated(user)) return redirect('/');
  const passes = await getEventPassOrdersFromStripeCheckoutSession({
    user,
    stripeCheckoutSessionId: session_id,
  });
  return <CartSuccessful passes={passes} />;
}
