'use server';

import { getCurrentUser } from '@next/next-auth/user';

import { Payment } from '@payment/admin';

export async function getStripeActiveCheckoutSession() {
  const payment = new Payment();
  const user = await getCurrentUser();
  const customer = await payment.getOrCreateStripeCustomer({ user });
  return payment.getStripeActiveCheckoutSessionForUser({
    stripeCustomerId: customer.stripeCustomerId,
  });
}
