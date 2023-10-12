'use server';

import { UserPassPendingOrder } from '@features/cart-types';
import { getCurrentUser } from '@next/next-auth/user';

import { type Locale } from '@gql/shared/types';
import { getCurrencyPreference } from '@next/currency';
import { Payment } from '@payment/admin';
import { StripeCustomer } from '@payment/types';

export interface CreateStripeCheckoutSessionInput {
  eventPassPendingOrders: UserPassPendingOrder[];
  locale: Locale;
}

export async function createStripeCheckoutSession({
  eventPassPendingOrders,
  locale,
}: CreateStripeCheckoutSessionInput) {
  const payment = new Payment();
  const user = await getCurrentUser();
  if (!user) throw new Error('User not found');
  const customer = await payment.getOrCreateStripeCustomer({ user });
  if (!customer) throw new Error('Customer not found');
  const stripeCustomer = await payment.getStripeCustomer({
    stripeCustomerId: customer.stripeCustomerId,
  });
  await payment.createStripeCheckoutSession({
    user,
    stripeCustomer: stripeCustomer as StripeCustomer,
    eventPassPendingOrders,
    locale,
    currency: getCurrencyPreference(),
  });
  return payment.getStripeActiveCheckoutSessionForUser({
    stripeCustomerId: customer.stripeCustomerId,
  });
}
