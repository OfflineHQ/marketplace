import { stripeCheckoutStatus } from '@payment/webhooks';

export const maxDuration = 20;

export async function POST(req: Request) {
  return stripeCheckoutStatus(req);
}
