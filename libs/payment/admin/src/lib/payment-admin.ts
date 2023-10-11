import env from '@env/server';
import { UserPassPendingOrder } from '@features/cart-types';
import { AppUser } from '@next/types';
import { NftClaimable } from '@nft/thirdweb-admin';
import {
  StripeCheckoutSessionMetadataEventPassOrder,
  StripeCreateSessionLineItem,
} from '@payment/types';
import { getNextAppURL } from '@shared/server';
import Stripe from 'stripe';

export class Payment {
  private stripe: Stripe;
  private nftClaimable: NftClaimable;
  baseUrl = getNextAppURL();
  constructor() {
    this.stripe = new Stripe(env.STRIPE_API_KEY, {
      apiVersion: '2023-08-16',
      typescript: true,
    });
    this.nftClaimable = new NftClaimable();
  }
  webhookStripeConstructEvent({
    body,
    signature,
  }: {
    body: string;
    signature: string;
  }) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  }

  // ref https://stripe.com/docs/api/customers/retrieve
  async getStripeCustomer({ stripeCustomerId }: { stripeCustomerId: string }) {
    return this.stripe.customers.retrieve(stripeCustomerId);
  }
  async createStripeCustomer({ user }: { user: AppUser }) {
    //TODO get data from sumsub to create
    return this.stripe.customers.create({
      email: user.email,
      // preferred_locales: ['en'],
      // name: user.name,
      // phone: user.phone,
      metadata: {
        userId: user.id,
      },
    });
  }
  async updateStripeCustomer({
    stripeCustomerId,
    user,
  }: {
    stripeCustomerId: string;
    user: AppUser;
  }) {
    //TODO get data from sumsub to update + update locale if changed (get from cookie)
    return this.stripe.customers.update(stripeCustomerId, {
      email: user.email,
      // preferred_locales: ['en'],
      // name: user.name,
      // phone: user.phone,
      metadata: {
        userId: user.id,
      },
    });
  }

  // TODO us stripe customer api to save payment method (card etc) for future use
  //ref: https://stripe.com/docs/payments/save-during-payment
  //ref:https://stripe.com/docs/api/customers/object#customer_object-invoice_settings-default_payment_method

  //ref: https://stripe.com/docs/api/checkout/sessions/create
  // TODO, store the checkout session and link it with the eventPassOrder in a new model StripeCheckoutSession. Make it recoverable in case of expiration and redirect user in case it's pending on the cart page.
  // set to expired in case it overlap the saleEnd of the eventPass and make sur it's not recovered in that case.
  async createStripeCheckoutSession({
    user,
    eventPassPendingOrders,
  }: {
    user: AppUser;
    eventPassPendingOrders: UserPassPendingOrder[];
  }) {
    const success_url = `${this.baseUrl}/cart/success`;
    const cancel_url = `${this.baseUrl}/cart`;
    // TODO apply price data, quantity and metadata (image, name etc)
    const lineItems = eventPassPendingOrders.map((eventPassPendingOrder) => {
      return {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: 2000,
          product_data: {
            name: 'T-shirt',
            images: ['https://example.com/t-shirt.png'],
            metadata: {
              userId: user.id,
              eventPassPendingOrderId: eventPassPendingOrder.id,
              eventPassId: eventPassPendingOrder.eventPassId,
              eventSlug: eventPassPendingOrder.eventPass?.event?.slug as string,
              organizerSlug: eventPassPendingOrder.eventPass?.event?.organizer
                ?.slug as string,
              // could add more if needed
            },
          },
        },
      } satisfies StripeCreateSessionLineItem;
    });

    const metadata = {
      userId: user.id,
      eventPassOrderIds: eventPassPendingOrders
        .map((order) => order.id)
        .join(','),
      organizerSlugs: eventPassPendingOrders
        .map((order) => order.eventPass?.event?.organizer?.slug)
        .join(','),
      eventSlugs: eventPassPendingOrders
        .map((order) => order.eventPass?.event?.slug)
        .join(','),
      eventPassIds: eventPassPendingOrders
        .map((order) => order.eventPassId)
        .join(','),
      // eventPassPendingOrders: JSON.stringify(eventPassPendingOrders),
    } satisfies StripeCheckoutSessionMetadataEventPassOrder;

    // TODO
    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      customer_email: user.email,
      client_reference_id: user.id,
      // customer: stripeCustomerId, // TODO store in new table StripeCustomer, link to user account id, and set here to make the payment faster next time (save card etc).
      currency: 'eur', // TODO, get from user preference
      locale: 'en', // TODO, get from user preference
      metadata,
      mode: 'payment',
      success_url,
      cancel_url: cancel_url,
      // expires_at: // TODO, set to a certain amount of time as set in the eventParameters and make sure it stop at most at the saleEnd.
      // TODO: option to put payment on_hold (not supported for every payment method)
      // payment_method_types: ['card', 'alipay', ...],
      // payment_intent_data: {
      //   capture_method: 'manual', // here we put on hold the payment (don't capture payment) to facilitate refund in case NFT not delivered for any reason. https://stripe.com/docs/payments/place-a-hold-on-a-payment-method
      // },
      // TODO: option to save payment method (not supported for every payment method), Can add a checkbox before checkout to allow this options. Could be used to show beforehand by default if payment method saved and if user want to continue with this option.
      // payment_intent_data: {
      //   setup_future_usage: 'on_session', // see alternative with 'off_session' here: https://stripe.com/docs/payments/save-during-payment
      // }
    });
    // NEED to do both in the same Hasura transaction (sequential transaction to avoid edge case where limit is reached on eventPass quantity)
    // TODO: delete corresponding eventPassPendingOrders
    // TODO: create eventPassOrders with status CONFIRMED and link them to a newly created StripeCheckoutSession (of type EVENT_PASS_ORDER).
  }

  // Used for instance in case the event is cancelled or claim phase finished.
  async expireStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    await this.stripe.checkout.sessions.expire(stripeCheckoutSessionId);
    //TODO: delete StripeCheckoutSession
  }

  async getStripeActiveCheckoutSessionForUser({
    stripeCustomerId,
  }: {
    stripeCustomerId: string;
  }) {
    //TODO: retrieve the StripeCheckoutSession with stripeCustomerId, if none mean the user has no active checkout session so no need to automatically redirect him to /cart/checkout.
  }

  async canceledStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    //TODO: retrieve eventPendingOrders from StripeCheckoutSession and mark them as CANCELLED.
    //TODO: delete StripeCheckoutSession
  }

  async confirmedStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    //TODO: delete StripeCheckoutSession
    //TODO: retrieve eventPassPendingOrders from StripeCheckoutSession and invoke the releaseNFT mutation.
    // return this.nftClaimable.claimAllMetadatas(eventPassOrders);
  }

  // used in case the NFT is not released for any reason or if event is cancelled.
  async refundPayment({ paymentIntentId }: { paymentIntentId: string }) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    //TODO: delete StripeCheckoutSession
    if (refund && ['succeeded', 'pending'].includes(refund.status))
      return refund;
    throw new Error(
      `Refund failed for paymentIntentId: ${paymentIntentId} with status: ${refund.status}`
    );
  }
}
