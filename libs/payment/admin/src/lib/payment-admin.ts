import env from '@env/server';
import { UserPassPendingOrder } from '@features/cart-types';
import { getSumSubApplicantPersonalData } from '@features/kyc-api';
import { adminSdk } from '@gql/admin/api';
import {
  KycStatus_Enum,
  OrderStatus_Enum,
  Stage,
  StripeCheckoutSessionType_Enum,
  type Locale,
} from '@gql/shared/types';
import { AppUser } from '@next/types';
import { NftClaimable } from '@nft/thirdweb-admin';
import {
  StripeCheckoutSessionMetadataEventPassOrder,
  StripeCreateSessionLineItem,
  StripeCustomer,
} from '@payment/types';
import { getNextAppURL } from '@shared/server';
import Stripe from 'stripe';

export class Payment {
  stripe: Stripe;
  nftClaimable: NftClaimable;
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
      env.STRIPE_WEBHOOK_SECRET,
    );
  }

  // ref https://stripe.com/docs/api/customers/retrieve
  async getStripeCustomer({ stripeCustomerId }: { stripeCustomerId: string }) {
    return this.stripe.customers.retrieve(stripeCustomerId);
  }
  async getOrCreateStripeCustomer({ user }: { user: AppUser }) {
    const { kyc } = user;
    if (!kyc) throw new Error(`Missing kyc for user: ${user.id}`);
    const existingStripeCustomer = await adminSdk.GetStripeCustomerByAccount({
      accountId: user.id,
    });
    if (existingStripeCustomer && existingStripeCustomer.stripeCustomer.length)
      return existingStripeCustomer.stripeCustomer[0];
    const userPersonalData = await getSumSubApplicantPersonalData(
      kyc.applicantId,
    );
    if (userPersonalData.review.reviewStatus !== KycStatus_Enum.Completed)
      throw new Error(
        `User: ${user.id} has not completed KYC: ${kyc.applicantId}`,
      );
    if (!userPersonalData.email) {
      throw new Error('Email is undefined for user: ' + user.id);
    }

    const stripeCustomer = await this.stripe.customers.create({
      email: userPersonalData.email,
      preferred_locales: [userPersonalData.lang || 'en'],
      phone: userPersonalData.phone,
      metadata: {
        userId: user.id,
      },
    });
    const createdStripeCustomer = await adminSdk.CreateStripeCustomer({
      stripeCustomer: {
        stripeCustomerId: stripeCustomer.id,
        accountId: user.id,
      },
    });
    return createdStripeCustomer?.insert_stripeCustomer_one;
  }
  async updateStripeCustomer({
    stripeCustomerId,
    user,
  }: {
    stripeCustomerId: string;
    user: AppUser;
  }) {
    //TODO: update with payment preference etc... and eventually update StripeCustomer in db
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

  // Delete corresponding eventPassPendingOrders and replace them by eventPassOrders with status CONFIRMED.
  async moveEventPassPendingOrdersToConfirmed({
    eventPassPendingOrders,
    accountId,
    locale,
  }: {
    eventPassPendingOrders: UserPassPendingOrder[];
    accountId: string;
    locale: Locale;
  }) {
    const res = await adminSdk.MoveEventPassPendingOrdersToConfirmed({
      eventPassPendingOrderIds: eventPassPendingOrders.map((order) => order.id),
      objects: eventPassPendingOrders.map((order) => ({
        eventPassId: order.eventPassId,
        status: OrderStatus_Enum.Confirmed,
        accountId,
        quantity: order.quantity,
      })),
      locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return res?.insert_eventPassOrder?.returning;
  }

  async markEventPassOrderAsCancelled({
    eventPassOrdersId,
  }: {
    eventPassOrdersId: string[];
  }) {
    return adminSdk.UpdateEventPassOrdersStatus({
      updates: eventPassOrdersId.map((id) => ({
        _set: {
          status: OrderStatus_Enum.Cancelled,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      })),
    });
  }

  async markEventPassOrderAsCompleted({
    eventPassOrdersId,
  }: {
    eventPassOrdersId: string[];
  }) {
    return adminSdk.UpdateEventPassOrdersStatus({
      updates: eventPassOrdersId.map((id) => ({
        _set: {
          status: OrderStatus_Enum.Completed,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      })),
    });
  }

  async markEventPassOrderAsRefunded({
    eventPassOrdersId,
  }: {
    eventPassOrdersId: string[];
  }) {
    return adminSdk.UpdateEventPassOrdersStatus({
      updates: eventPassOrdersId.map((id) => ({
        _set: {
          status: OrderStatus_Enum.Refunded,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      })),
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
    stripeCustomer,
    eventPassPendingOrders,
    locale,
    currency,
  }: {
    user: AppUser;
    stripeCustomer: StripeCustomer;
    eventPassPendingOrders: UserPassPendingOrder[];
    locale: Locale;
    currency: string;
  }) {
    const existingStripeCheckoutSession =
      await adminSdk.GetStripeCheckoutSessionForUser({
        stripeCustomerId: stripeCustomer.id,
      });
    if (
      existingStripeCheckoutSession &&
      existingStripeCheckoutSession.stripeCheckoutSession.length
    )
      throw new Error(
        `User: ${user.id} already has an active checkout session: ${existingStripeCheckoutSession.stripeCheckoutSession[0].stripeSessionId}`,
      );
    const success_url = `${this.baseUrl}/cart/success`;
    const cancel_url = `${this.baseUrl}/cart/canceled`;
    const orders = await this.moveEventPassPendingOrdersToConfirmed({
      eventPassPendingOrders,
      accountId: user.id,
      locale,
    });
    if (!orders || !orders.length)
      throw new Error(
        `No eventPassOrders created for user: ${
          user.id
        } and eventPassPendingOrders: ${eventPassPendingOrders
          .map((order) => order.id)
          .join(',')}`,
      );
    const lineItems = orders.map((order) => {
      if (
        !order.eventPassPricing?.priceCurrency ||
        !order.eventPassPricing?.priceAmount
      ) {
        throw new Error(
          'Price currency or Price amount is undefined for order: ' + order.id,
        );
      }

      return {
        quantity: order.quantity,
        price_data: {
          currency: order.eventPassPricing.priceCurrency,
          unit_amount: order.eventPassPricing.priceAmount,
          product_data: {
            name: order.eventPass?.name as string,
            images: [order.eventPass?.nftImage?.url as string],
            metadata: {
              userId: user.id,
              eventPassPendingOrderId: order.id,
              eventPassId: order.eventPassId,
              eventSlug: order.eventPass?.event?.slug as string,
              organizerSlug: order.eventPass?.event?.organizer?.slug as string,
              // could add more if needed
            },
          },
        },
      } satisfies StripeCreateSessionLineItem;
    });

    const metadata = {
      userId: user.id,
      eventPassOrderIds: orders.map((order) => order.id).join(','),
      organizerSlugs: orders
        .map((order) => order.eventPass?.event?.organizer?.slug)
        .join(','),
      eventSlugs: orders.map((order) => order.eventPass?.event?.slug).join(','),
      eventPassIds: orders.map((order) => order.eventPassId).join(','),
      // orders: JSON.stringify(orders),
    } satisfies StripeCheckoutSessionMetadataEventPassOrder;

    if (!stripeCustomer.email) {
      throw new Error(
        'Email is null for stripe customer: ' + stripeCustomer.id,
      );
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: user.id,
      customer: stripeCustomer.id,
      currency,
      locale,
      metadata,
      mode: 'payment',
      success_url,
      cancel_url,
      // expires_at: //by default it's 24h from creation.
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

    await adminSdk.SetEventPassOrdersStripeCheckoutSessionId({
      updates: orders.map(({ id }) => ({
        _set: {
          stripeCheckoutSessionId: session.id,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      })),
    });
    const res = await adminSdk.CreateStripeCheckoutSession({
      stripeCheckoutSession: {
        stripeSessionId: session.id,
        stripeCustomerId: stripeCustomer.id,
        type: StripeCheckoutSessionType_Enum.EventPassOrder,
      },
    });
    return res.insert_stripeCheckoutSession_one;
  }

  // Trigger a cancellation on the checkout. Used for instance in case the event is cancelled or claim phase finished.
  async expireStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    await this.stripe.checkout.sessions.expire(stripeCheckoutSessionId);
    const orders = await this.getEventPassOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    await this.markEventPassOrderAsCancelled({
      eventPassOrdersId: orders.map((order) => order.id),
    });
    await adminSdk.DeleteStripeCheckoutSession({
      stripeSessionId: stripeCheckoutSessionId,
    });
  }

  async getEventPassOrdersFromStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    const res = await adminSdk.GetEventPassOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    return res.eventPassOrder;
  }

  async getStripeActiveCheckoutSessionForUser({
    stripeCustomerId,
  }: {
    stripeCustomerId: string;
  }) {
    const res = await adminSdk.GetStripeCheckoutSessionForUser({
      stripeCustomerId,
    });
    if (!res || !res.stripeCheckoutSession.length) return null;
    const stripeCheckoutSession = res.stripeCheckoutSession[0];
    return this.stripe.checkout.sessions.retrieve(
      stripeCheckoutSession.stripeSessionId,
    );
  }

  async canceledStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    const orders = await this.getEventPassOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    await this.markEventPassOrderAsCancelled({
      eventPassOrdersId: orders.map((order) => order.id),
    });
    await adminSdk.DeleteStripeCheckoutSession({
      stripeSessionId: stripeCheckoutSessionId,
    });
  }

  async confirmedStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    const orders = await this.getEventPassOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    try {
      await this.nftClaimable.claimAllMetadatas(orders);
    } catch (e) {
      throw new Error(`Error claiming NFTs: ${e.message}`);
    }
    await this.markEventPassOrderAsCompleted({
      eventPassOrdersId: orders.map((order) => order.id),
    });
    await adminSdk.DeleteStripeCheckoutSession({
      stripeSessionId: stripeCheckoutSessionId,
    });
  }

  // used in case the NFT is not released for any reason or if event is cancelled.
  async refundPayment({
    paymentIntentId,
    checkoutSessionId,
  }: {
    paymentIntentId: string;
    checkoutSessionId: string;
  }) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    if (!refund?.status) {
      throw new Error(
        'Refund status is null for paymentIntentId: ' + paymentIntentId,
      );
    }
    if (['succeeded', 'pending'].includes(refund.status)) {
      const orders = await this.getEventPassOrdersFromStripeCheckoutSession({
        stripeCheckoutSessionId: checkoutSessionId,
      });
      await this.markEventPassOrderAsRefunded({
        eventPassOrdersId: orders.map((order) => order.id),
      });
      await adminSdk.DeleteStripeCheckoutSession({
        stripeSessionId: checkoutSessionId,
      });
      return refund;
    }
    if (['succeeded', 'pending'].includes(refund.status)) return refund;
    throw new Error(
      `Refund failed for paymentIntentId: ${paymentIntentId} with status: ${refund.status}`,
    );
  }
}
