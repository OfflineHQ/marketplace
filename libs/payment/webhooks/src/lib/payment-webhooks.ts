import { Payment } from '@payment/admin';
import {
  StripeCheckoutSession,
  StripeCheckoutSessionEnum,
  StripeEvent,
} from '@payment/types';
import { headers } from 'next/headers';

// const payment = new Payment();

//TODO: handle the following events when supporting delayed payment methods (for instance with the future auction feature):
// StripeCheckoutSessionEnum.paymentFailed
// StripeCheckoutSessionEnum.paymentSucceeded
const stripeCheckoutSessionEvents = [
  StripeCheckoutSessionEnum.completed,
  StripeCheckoutSessionEnum.expired,
];

// const sendRecoveryEmail = (email, recoveryUrl) => {
//   // TODO: fill me in
//   console.log('Sending recovery email', email, recoveryUrl);
// };

// const hasSentRecoveryEmailToCustomer = (email) => {
//   //TODO
//   return false;
// };

export async function stripeCheckoutStatus(
  req: Request,
  payment: Payment = new Payment(),
) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  let event: StripeEvent;
  try {
    event = payment.webhookStripeConstructEvent({ body, signature });
    console.log({ event });
    if (
      !stripeCheckoutSessionEvents.includes(
        event.type as StripeCheckoutSessionEnum,
      )
    ) {
      console.error(`Unhandled event type: ${event.type}`);
      return new Response(`Unhandled event type: ${event.type}`, {
        status: 400,
      });
    }
    const checkoutSession = event.data.object as StripeCheckoutSession;
    if (checkoutSession.mode !== 'payment') {
      console.error(`Unhandled mode: ${checkoutSession.mode}`);
      return new Response(`Unhandled mode: ${checkoutSession.mode}`, {
        status: 400,
      });
    }
    //console.log({ checkoutSession });

    // const currency = checkoutSession.currency;
    // const amount_total = checkoutSession.amount_total;
    // const amount_subtotal = checkoutSession.amount_subtotal;
    // const line_items = checkoutSession.line_items.data;
    // const metadata =
    //   checkoutSession.metadata as StripeCheckoutSessionMetadataEventPassOrder;
    if (
      (event.type as StripeCheckoutSessionEnum) ===
      StripeCheckoutSessionEnum.completed
    ) {
      if (checkoutSession.payment_status !== 'paid') {
        console.warn(
          `Payment not paid, payment_status: ${checkoutSession.payment_status}`,
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
        //TODO: refund only if NFT not released ! filter the error depending of that.
        if (!err.message?.includes('Error claiming NFTs'))
          return new Response(
            `ConfirmedStripeCheckoutSession Error: ${err.message}`,
            { status: 500 },
          );
        //TODO: notify user and refund order because NFT not released.
        try {
          let paymentIntentId;
          if (typeof checkoutSession.payment_intent === 'string') {
            paymentIntentId = checkoutSession.payment_intent;
          } else if (checkoutSession.payment_intent) {
            paymentIntentId = checkoutSession.payment_intent.id;
          }

          if (!paymentIntentId) {
            console.error(
              `No payment_intent found for refund in checkoutSession: ${checkoutSession.id}`,
            );
            return new Response(
              `No payment_intent found for refund in checkoutSession: ${checkoutSession.id}`,
              { status: 500 },
            );
          } else {
            await payment.refundPayment({
              paymentIntentId,
              checkoutSessionId: checkoutSession.id,
            });
          }
        } catch (err) {
          console.error(err);
        }
        return new Response(null, { status: 200 });
      }
    } else if (event.type === 'checkout.session.expired') {
      // TODO: notify user and cancel orders
      try {
        await payment.canceledStripeCheckoutSession({
          stripeCheckoutSessionId: checkoutSession.id,
        });
        return new Response(null, { status: 200 });
      } catch (err) {
        console.error(err);
        return new Response(
          `CanceledStripeCheckoutSession Error: ${err.message}`,
          { status: 400 },
        );
      }
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
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  return new Response(null, { status: 200 });
}
