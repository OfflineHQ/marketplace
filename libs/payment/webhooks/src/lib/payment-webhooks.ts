import { Payment } from '@payment/admin';
import {
  StripeCheckoutSession,
  StripeCheckoutSessionMetadataEventPassOrder,
  StripeEvent,
} from '@payment/types';
import { headers } from 'next/headers';

const payment = new Payment();

//TODO: handle the following events when supporting delayed payment methods (for instance with the future auction feature):
// checkout.session.async_payment_failed
// Occurs when a payment intent using a delayed payment method fails.
// checkout.session.async_payment_succeeded
// Occurs when a payment intent using a delayed payment method finally succeeds.

// checkout.session.completed
// Occurs when a Checkout Session has been successfully completed.
// checkout.session.expired
// Occurs when a Checkout Session is expired.

const stripeCheckoutSessionEvents = [
  'checkout.session.completed',
  'checkout.session.expired',
];

// const sendRecoveryEmail = (email, recoveryUrl) => {
//   // TODO: fill me in
//   console.log('Sending recovery email', email, recoveryUrl);
// };

// const hasSentRecoveryEmailToCustomer = (email) => {
//   //TODO
//   return false;
// };

export async function stripeCheckoutStatus(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  let event: StripeEvent;
  try {
    event = payment.webhookStripeConstructEvent({ body, signature });
    if (!stripeCheckoutSessionEvents.includes(event.type)) {
      console.error(`Unhandled event type: ${event.type}`);
      return new Response(null, { status: 200 });
    }
    const checkoutSession = event.data.object as StripeCheckoutSession;
    if (checkoutSession.mode !== 'payment') {
      console.error(`Unhandled mode: ${checkoutSession.mode}`);
      return new Response(null, { status: 200 });
    }
    console.log({ checkoutSession });

    const currency = checkoutSession.currency;
    const amount = checkoutSession.amount_total;
    const line_items = checkoutSession.line_items.data;
    const metadata =
      checkoutSession.metadata as StripeCheckoutSessionMetadataEventPassOrder;
    if (event.type === 'checkout.session.completed') {
      //TODO update user with stripeCustomerId
      if (checkoutSession.payment_status !== 'paid') {
        console.error(
          `Payment not paid, payment_status: ${checkoutSession.payment_status}`
        );
        return new Response(null, { status: 200 });
      }
      try {
        //TODO release the NFTs.
        await payment.confirmedStripeCheckoutSession({
          stripeCheckoutSessionId: checkoutSession.id,
        });
      } catch (err) {
        console.error(err);
        //TODO: notify user and refund order because NFT not released.
        if (!checkoutSession.payment_intent)
          console.error(
            `No payment_intent found for refund in checkoutSession: ${checkoutSession.id}`
          );
        else
          try {
            await payment.refundPayment({
              paymentIntentId: checkoutSession.payment_intent as string,
            });
          } catch (err) {
            console.error(err);
          }
        return new Response(null, { status: 200 });
      }
    } else if (event.type === 'checkout.session.expired') {
      // TODO: notify user and cancel orders
      await payment.canceledStripeCheckoutSession({
        stripeCheckoutSessionId: checkoutSession.id,
      });
      return new Response(null, { status: 200 });
      // TODO: establish a strategy where the user can pay again with https://stripe.com/docs/payments/checkout/abandoned-carts
      // TO BE NOTED: as is, the feature for consent to email promotion is only available in the US. Might need to implement our own consent system with checkbox (maybe next to the 'save payment method'?).
      // When a Checkout Session expires, the buyer's email is not returned in
      // the webhook payload unless they give consent for promotional content
      /*const email = checkoutSession.customer_details?.email;
      const recoveryUrl = checkoutSession.after_expiration?.recovery?.url;

      // Do nothing if the Checkout Session has no email or recovery URL
      if (!email || !recoveryUrl) {
        return new Response(null, { status: 200 });
      }

      // Check if the buyer has consented to promotional emails and
      // avoid spamming people who abandon Checkout multiple times
      if (
        checkoutSession.consent?.promotions === 'opt_in' &&
        !hasSentRecoveryEmailToCustomer(email)
      ) {
        sendRecoveryEmail(email, recoveryUrl);
      }*/
    }

    console.log({ event });
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  return new Response(null, { status: 200 });
}
