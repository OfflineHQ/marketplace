import { stripeCheckoutStatus } from '@payment/webhooks';

export const maxDuration = 30;

// This route has been moved to pages/api regarding a Thirdweb and NextJS 14 error, it should be moved back into app/api when the error will be fix https://github.com/AlexandreG-tech/Server-Action-Error
export async function POST(req: Request) {
  return stripeCheckoutStatus(req);
}
