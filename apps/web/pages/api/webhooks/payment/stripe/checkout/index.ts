import { Payment } from '@payment/admin';
import { stripeCheckoutStatus } from '@payment/webhooks';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 30,
};

// This route has been moved to pages/api regarding a Thirdweb and NextJS 14 error, it should be moved back into app/api when the error will be fix https://github.com/AlexandreG-tech/Server-Action-Error
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    let data = Buffer.alloc(0);
    req.on('data', (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const payload = buffer.toString();
  const signature = req.headers['stripe-signature'] as string;

  const response = await stripeCheckoutStatus(
    new Payment(),
    signature,
    payload,
  );
  res.status(response.status).json(response.body);
}
