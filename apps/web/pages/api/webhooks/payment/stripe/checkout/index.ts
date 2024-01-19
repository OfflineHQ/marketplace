import { Payment } from '@payment/admin';
import { stripeCheckoutStatus } from '@payment/webhooks';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
