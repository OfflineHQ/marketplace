import { isServerSide } from '@utils';
import Stripe from 'stripe';
import env from '@env/server';

export class Payment {
  private stripe: Stripe;
  constructor() {
    if (!isServerSide()) {
      throw new Error('Payment admin lib need to be used in server side');
    }
    if (!env.STRIPE_API_KEY || !env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_API_KEY or STRIPE_WEBHOOK_SECRET is missing');
    }
    this.stripe = new Stripe(env.STRIPE_API_KEY, {
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
      env.STRIPE_WEBHOOK_SECRET
    );
  }
}
