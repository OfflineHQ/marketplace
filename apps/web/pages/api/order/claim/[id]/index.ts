import { adminSdk } from '@gql/admin/api';
import { NftClaimable } from '@nft/thirdweb-admin';

export const maxDuration = 300;

// This route has been moved to pages/api regarding a Thirdweb and NextJS 14 error, it should be moved back into app/api when the error will be fix https://github.com/AlexandreG-tech/Server-Action-Error
export async function GET(req: Request, { params: { id } }) {
  const order = (await adminSdk.GetOrderFromId({ id })).order_by_pk;
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
