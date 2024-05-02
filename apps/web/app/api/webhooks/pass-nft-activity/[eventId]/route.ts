import type { AlchemyRequest } from '@indexer/alchemy/types';
import { eventPassActivity } from '@indexer/alchemy/webhooks';

export async function POST(req: AlchemyRequest, { params: { eventId } }) {
  return eventPassActivity(req, eventId);
}
