import env from '@env/server';
import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { AppUser } from '@next/types';
import { Payment } from '@payment/admin';
import { StripeCheckoutSessionMetadataEventPassOrder } from '@payment/types';

export type GetEventPassOrdersFromStripeCheckoutSessionProps = {
  stripeCheckoutSessionId: string;
  user: AppUser;
};

export const getEventPassOrdersFromStripeCheckoutSession = async ({
  stripeCheckoutSessionId,
  user,
}: GetEventPassOrdersFromStripeCheckoutSessionProps) => {
  const payment = new Payment();
  const session = await payment.getStripeCheckoutSession({
    stripeCheckoutSessionId,
  });
  const customer = await payment.getOrCreateStripeCustomer({ user });
  if (
    payment.getStripeCustomerId(session.customer) === customer?.stripeCustomerId
  ) {
    const metadata =
      session.metadata as StripeCheckoutSessionMetadataEventPassOrder;
    const eventPassOrderIds = metadata.eventPassOrderIds.split(',');
    const res = await userSdk.GetEventPassOrdersFromIds({
      eventPassOrderIds,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return res.eventPassOrder;
  } else throw new Error('Customer or Stripe Checkout session not found');
};
