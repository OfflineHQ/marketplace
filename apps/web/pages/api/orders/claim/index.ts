import { adminSdk } from '@gql/admin/api';
import { deleteOrders, setOrdersToBusy } from '@features/orders-cron';
import { NextRedis } from '@next/redis';
import { NftClaimable } from '@nft/thirdweb-admin';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderIds, eventPassId } = req.body;

  if (!orderIds || !eventPassId || orderIds.length === 0) {
    return res.status(400).json({ error: 'No order IDs provided' });
  }

  const cache = new NextRedis();
  const claim = new NftClaimable();

  try {
    await setOrdersToBusy(cache, eventPassId, orderIds);

    const minterTemporaryWallet = (
      await adminSdk.GetMinterTemporaryWalletByEventPassId({ eventPassId })
    ).minterTemporaryWallet[0];

    await cache.kv.set(minterTemporaryWallet.address, 'busy');

    const orders = (await adminSdk.GetOrdersWithClaimInfo({ ids: orderIds }))
      .order;

    await claim.multicallClaim(minterTemporaryWallet, orders);

    await deleteOrders(cache, eventPassId, orderIds);

    return res.status(200);
  } catch (e) {
    return res.status(500).json(e);
  }
}
