import { Stripe } from 'stripe';

export type StripeEvent = Stripe.Event;
export type StripeCustomer = Stripe.Customer;
export type StripeCreateSessionLineItem =
  Stripe.Checkout.SessionCreateParams.LineItem;
//ref: https://stripe.com/docs/api/checkout/sessions/object

export type StripeCheckoutSession = Stripe.Checkout.Session;

export type StripeCheckoutSessionMetadataEventPassOrder = {
  userId: string;
  eventPassOrderIds: string;
  organizerSlugs: string;
  eventSlugs: string;
  eventPassIds: string;
};
