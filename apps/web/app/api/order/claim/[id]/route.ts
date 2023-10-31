import { adminSdk } from '@gql/admin/api';
import { NftClaimable } from '@nft/thirdweb-admin';

export const maxDuration = 300;

export async function GET(req: Request, { params: { id } }) {
  const order = (await adminSdk.GetEventPassOrderFromId({ id }))
    .eventPassOrder[0];
  const nft = new NftClaimable();

  if (!order) {
    return Response.error();
  }

  try {
    await nft.claimOrder(order);
    return Response.json({ status: 'success', id });
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}
