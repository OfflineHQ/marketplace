import type { AlchemyRequest } from '@indexer/alchemy/types';
import { nftActivity } from '@indexer/alchemy/webhooks';

//TODO test
export async function POST(req: AlchemyRequest, { params: { eventId } }) {
  return nftActivity(req, eventId);
}
