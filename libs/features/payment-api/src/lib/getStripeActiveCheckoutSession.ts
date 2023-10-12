'use server';

import { getCurrentUser } from '@next/next-auth/user';

import { Payment } from '@payment/admin';

export async function getStripeActiveCheckoutSession() {
  const payment = new Payment();
  const user = await getCurrentUser();
  if (!user) throw new Error('User not found');
  const customer = await payment.getOrCreateStripeCustomer({ user });
  if (!customer) throw new Error('Customer not found');
  return payment.getStripeActiveCheckoutSessionForUser({
    stripeCustomerId: customer.stripeCustomerId,
  });
}
