import env from '@env/server';
import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { AppUser } from '@next/types';
import { Payment } from '@payment/admin';
import { StripeCheckoutSessionMetadataOrder } from '@payment/types';

export type GetOrdersFromStripeCheckoutSessionProps = {
  stripeCheckoutSessionId: string;
  user: AppUser;
};

export const getOrdersFromStripeCheckoutSession = async (
  { stripeCheckoutSessionId, user }: GetOrdersFromStripeCheckoutSessionProps,
  payment = new Payment(),
) => {
  const session = await payment.getStripeCheckoutSession({
    stripeCheckoutSessionId,
  });
  const customer = await payment.getOrCreateStripeCustomer({ user });
  if (
    payment.getStripeCustomerId(session.customer) === customer?.stripeCustomerId
  ) {
    const metadata = session.metadata as StripeCheckoutSessionMetadataOrder;
    const orderIds = metadata.orderIds.split(',');
    const res = await userSdk.GetOrdersFromIds({
      orderIds,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return res.order;
  } else throw new Error('Customer or Stripe Checkout session not found');
};
