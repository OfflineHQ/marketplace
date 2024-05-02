'use server';

import { adminSdk } from '@gql/admin/api';
import { getCurrentUser } from '@next/next-auth/user';
import { Payment } from '@payment/admin';

export async function cancelPurchaseForUser() {
  const user = await getCurrentUser();

  if (user) {
    const stripeCustomer = await adminSdk.GetStripeCustomerByAccount({
      accountId: user.id,
    });
    const stripeCustomerId = stripeCustomer.stripeCustomer[0].stripeCustomerId;
    const session = await adminSdk.GetStripeCheckoutSessionForUser({
      stripeCustomerId: stripeCustomerId,
    });

    const sdk = new Payment();
    await sdk.expireStripeCheckoutSession({
      stripeCheckoutSessionId: session.stripeCheckoutSession[0].stripeSessionId,
    });
  } else throw new Error('Error : user is undefined');
}
