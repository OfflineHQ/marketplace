import { stripeCheckoutStatus } from '@payment/webhooks';

export async function POST(req: Request) {
  return stripeCheckoutStatus(req);
}
