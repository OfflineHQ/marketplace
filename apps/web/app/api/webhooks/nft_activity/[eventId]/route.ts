import { nftActivity, type AlchemyRequest } from '@indexer/alchemy/webhooks';

export async function POST(req: AlchemyRequest, { params: { eventId } }) {
  return nftActivity(req, eventId);
}
