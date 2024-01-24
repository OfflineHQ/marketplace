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
import { Posthog } from '@insight/server';
import { FeatureFlagsEnum } from '@insight/types';
import { CurrencyCache } from '@next/currency-cache';
import { calculateUnitAmount } from '@next/currency-common';
import { AppUser } from '@next/types';
import { NftClaimable } from '@nft/thirdweb-admin';
import {
  StripeCheckoutSessionMetadataOrder,
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
  async createStripeCustomer({
    user,
    kycFlag,
  }: {
    user: AppUser;
    kycFlag: boolean;
  }) {
    const { kyc, address, email } = user;
    if (!kycFlag) {
      const stripeCustomer = await this.stripe.customers.create({
        email,
        // preferred_locales: [userPersonalData.lang || 'en'],
        // phone: userPersonalData.phone,
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
    } else {
      if (!kyc || !kyc.applicantId)
        throw new Error(`Missing kyc for user: ${user.id}`);
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
  }
  async getOrCreateStripeCustomer({ user }: { user: AppUser }) {
    const { kyc, address } = user;
    const kycFlag = await Posthog.getInstance().getFeatureFlag(
      FeatureFlagsEnum.KYC,
      address,
    );
    if (kycFlag && !kyc) throw new Error(`Missing kyc for user: ${user.id}`);
    const existingStripeCustomerRes = await adminSdk.GetStripeCustomerByAccount(
      {
        accountId: user.id,
      },
    );
    if (existingStripeCustomerRes?.stripeCustomer?.length)
      return existingStripeCustomerRes.stripeCustomer[0];
    return this.createStripeCustomer({ user, kycFlag });
  }
  async updateStripeCustomer({
    stripeCustomerId,
    user,
  }: {
    stripeCustomerId: string;
    user: AppUser;
  }) {
    //TODO: update with payment preference etc...
    const res = await this.stripe.customers.update(stripeCustomerId, {
      email: user.email,
      // preferred_locales: ['en'],
      // name: user.name,
      // phone: user.phone,
      metadata: {
        userId: user.id,
      },
    });
    // here update stripe customer in db to have updated_at set
    await adminSdk.UpdateStripeCustomer({
      stripeCustomerId,
      stripeCustomer: {
        accountId: user.id,
      },
    });
    return res;
  }

  // Delete corresponding pendingOrders and replace them by orders with status CONFIRMED.
  async movePendingOrdersToConfirmed({
    pendingOrders,
    accountId,
    locale,
  }: {
    pendingOrders: UserPassPendingOrder[];
    accountId: string;
    locale: Locale;
  }) {
    const res = await adminSdk.MovePendingOrdersToConfirmed({
      pendingOrderIds: pendingOrders.map((order) => order.id),
      objects: pendingOrders.map((order) => ({
        eventPassId: order.eventPassId,
        status: OrderStatus_Enum.Confirmed,
        accountId,
        quantity: order.quantity,
      })),
      locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return res?.insert_order?.returning;
  }

  async markOrderAsCancelled({ ordersId }: { ordersId: string[] }) {
    return adminSdk.UpdateOrdersStatus({
      updates: ordersId.map((id) => ({
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

  async markOrderAsRefunded({ ordersId }: { ordersId: string[] }) {
    return adminSdk.UpdateOrdersStatus({
      updates: ordersId.map((id) => ({
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
  // TODO, store the checkout session and link it with the order in a new model StripeCheckoutSession. Make it recoverable in case of expiration and redirect user in case it's pending on the cart page.
  // set to expired in case it overlap the saleEnd of the eventPass and make sur it's not recovered in that case.
  async createStripeCheckoutSession({
    user,
    stripeCustomer,
    pendingOrders,
    locale,
    currency,
  }: {
    user: AppUser;
    stripeCustomer: StripeCustomer;
    pendingOrders: UserPassPendingOrder[];
    locale: Locale;
    currency: string;
  }) {
    const currencyCache = new CurrencyCache();
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
    const success_url = `${this.baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${this.baseUrl}/cart/canceled?session_id={CHECKOUT_SESSION_ID}`;
    const orders = await this.movePendingOrdersToConfirmed({
      pendingOrders,
      accountId: user.id,
      locale,
    });
    if (!orders || !orders.length)
      throw new Error(
        `No orders created for user: ${
          user.id
        } and pendingOrders: ${pendingOrders
          .map((order) => order.id)
          .join(',')}`,
      );

    const rates = await currencyCache.getRates();

    const lineItemsPromises = orders.map(async (order) => {
      if (!order.passPricing?.currency || !order.passPricing?.amount) {
        throw new Error(
          'Price currency or Price amount is undefined for order: ' + order.id,
        );
      }
      if (order.passPricing?.amount < 0) {
        throw new Error('Price amount is negative for order: ' + order.id);
      }

      if (Object.keys(rates).length === 0) {
        throw new Error('Rates are empty for order: ' + order.id);
      }

      let currencyStripe: string;
      let unitAmount: number;

      if (currency === order.passPricing.currency) {
        currencyStripe = currency.toLowerCase();
        unitAmount = order.passPricing.amount;
      } else {
        currencyStripe = currency.toLowerCase();
        unitAmount = calculateUnitAmount(
          {
            amount: order.passPricing.amount,
            currency: order.passPricing.currency,
          },
          rates,
        );
      }

      return {
        quantity: order.quantity,
        price_data: {
          currency: currencyStripe,
          unit_amount: unitAmount,
          product_data: {
            name: order.eventPass?.name as string,
            images: [order.eventPass?.nftImage?.url as string],
            metadata: {
              userId: user.id,
              pendingOrderId: order.id,
              eventPassId: order.eventPassId as string,
              packId: order.packId as string,
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
      orderIds: orders.map((order) => order.id).join(','),
      organizerSlugs: orders
        .map((order) => order.eventPass?.event?.organizer?.slug)
        .join(','),
      eventSlugs: orders.map((order) => order.eventPass?.event?.slug).join(','),
      eventPassIds: orders
        .filter(({ eventPassId }) => !!eventPassId)
        .map((order) => order.eventPassId)
        .join(','),
      packIds: orders
        .filter(({ packId }) => !!packId)
        .map((order) => order.packId)
        .join(','),
      // orders: JSON.stringify(orders),
    } satisfies StripeCheckoutSessionMetadataOrder;

    if (!stripeCustomer.email) {
      throw new Error(
        'Email is null for stripe customer: ' + stripeCustomer.id,
      );
    }
    const lineItems = await Promise.all(lineItemsPromises);

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: user.id,
      customer: stripeCustomer.id,
      currency: currency.toLowerCase(),
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
    const res = await adminSdk.CreateStripeCheckoutSession({
      stripeCheckoutSession: {
        stripeSessionId: session.id,
        stripeCustomerId: stripeCustomer.id,
        type: StripeCheckoutSessionType_Enum.EventPassOrder,
      },
    });
    await adminSdk.SetOrdersStripeCheckoutSessionId({
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
    return res.insert_stripeCheckoutSession_one;
  }

  // Trigger a cancellation on the checkout. Used for instance in case the event is cancelled or claim phase finished.
  async expireStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    await this.stripe.checkout.sessions.expire(stripeCheckoutSessionId);
    const orders = await this.getOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    await this.markOrderAsCancelled({
      ordersId: orders.map((order) => order.id),
    });
    await adminSdk.DeleteStripeCheckoutSession({
      stripeSessionId: stripeCheckoutSessionId,
    });
  }

  async getOrdersFromStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    const res = await adminSdk.GetOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    return res.order;
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

  async getStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    return this.stripe.checkout.sessions.retrieve(stripeCheckoutSessionId);
  }

  getStripeCustomerId(
    customer: Stripe.Checkout.Session['customer'],
  ): string | null {
    if (typeof customer === 'string') {
      return customer;
    } else if (
      customer &&
      'id' in customer &&
      typeof customer.id === 'string'
    ) {
      return customer.id;
    } else {
      return null;
    }
  }

  async canceledStripeCheckoutSession({
    stripeCheckoutSessionId,
  }: {
    stripeCheckoutSessionId: string;
  }) {
    const orders = await this.getOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });
    await this.markOrderAsCancelled({
      ordersId: orders.map((order) => order.id),
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
    const orders = await this.getOrdersFromStripeCheckoutSession({
      stripeCheckoutSessionId,
    });

    try {
      const checkOrderPromises = orders.map(async (order) => {
        await this.nftClaimable.checkOrder(order);
        return order;
      });
      const checkedOrders = await Promise.all(checkOrderPromises);
      const fetchPromises = checkedOrders.map((order) =>
        fetch(`${getNextAppURL()}api/order/claim/${order.id}`),
      );
      Promise.all(fetchPromises);
    } catch (error) {
      throw new Error(`Error claiming NFTs : ${error.message}`);
    }

    await adminSdk.DeleteStripeCheckoutSession({
      stripeSessionId: stripeCheckoutSessionId,
    });
  }

  async refundPartialPayment({
    paymentIntentId,
    amount,
  }: {
    paymentIntentId: string;
    amount: number;
  }) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });
    if (!refund?.status) {
      throw new Error(
        'Refund status is null for paymentIntentId: ' + paymentIntentId,
      );
    }
    if (['succeeded', 'pending'].includes(refund.status)) {
      return refund;
    }
    throw new Error(
      `Partial refund failed for paymentIntentId: ${paymentIntentId} with status: ${refund.status}`,
    );
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
      const orders = await this.getOrdersFromStripeCheckoutSession({
        stripeCheckoutSessionId: checkoutSessionId,
      });
      await this.markOrderAsRefunded({
        ordersId: orders.map((order) => order.id),
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
