import { adminSdk } from '@gql/admin/api';
import { NftClaimable } from '@nft/thirdweb-admin';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 300;

// This route has been moved to pages/api regarding a Thirdweb and NextJS 14 error, it should be moved back into app/api when the error will be fix https://github.com/AlexandreG-tech/Server-Action-Error
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const order = (await adminSdk.GetOrderFromId({ id: id as string }))
    .order_by_pk;
  const nft = new NftClaimable();

  if (!order) {
    return res.status(400).json({ error: 'Order not found' });
  }

  try {
    await nft.claimOrder(order);
    return res.status(200).json({ status: 'success', id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'An error occurred' });
  }
}
