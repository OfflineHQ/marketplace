import { isServerSide } from '@utils';
import Stripe from 'stripe';

export class Payment {
  private stripe: Stripe;
  constructor() {
    if (!isServerSide()) {
      throw new Error('Payment admin lib need to be used in server side');
    }
    if (!process.env.STRIPE_API_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_API_KEY or STRIPE_WEBHOOK_SECRET is missing');
    }
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2023-08-16',
      typescript: true,
    });
  }
  webhookConstructEvent({
    body,
    signature,
  }: {
    body: string;
    signature: string;
  }) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  }
}
