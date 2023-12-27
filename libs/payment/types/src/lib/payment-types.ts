import { Stripe } from 'stripe';

export type StripeEvent = Stripe.Event;
export type StripeCustomer = Stripe.Customer;
export type StripeCreateSessionLineItem =
  Stripe.Checkout.SessionCreateParams.LineItem;
//ref: https://stripe.com/docs/api/checkout/sessions/object

export type StripeCheckoutSession = Stripe.Checkout.Session;

export type StripeCheckoutSessionMetadataOrder = {
  userId: string;
  eventPassOrderIds: string;
  organizerSlugs: string;
  eventSlugs: string;
  eventPassIds: string;
};

export type StripePaymentIntent = Stripe.PaymentIntent;

export enum StripeCheckoutSessionEnum {
  paymentFailed = 'checkout.session.payment_failed', // Occurs when a payment intent using a delayed payment method fails.
  paymentSucceeded = 'checkout.session.payment_succeeded', // Occurs when a payment intent using a delayed payment method finally succeeds.
  completed = 'checkout.session.completed', // Occurs when a Checkout Session has been successfully completed.
  expired = 'checkout.session.expired', // Occurs when a Checkout Session is expired.
}

export type StripeCheckoutPaymentStatus = Stripe.Checkout.Session.PaymentStatus;
export type StripeCheckoutSessionMode = Stripe.Checkout.Session.Mode;
