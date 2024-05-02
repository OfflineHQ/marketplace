import type { AlchemyRequest } from '@indexer/alchemy/types';
import { loyaltyCardActivity } from '@indexer/alchemy/webhooks';

export async function POST(req: AlchemyRequest, { params: { loyaltyCardId } }) {
  return loyaltyCardActivity(req, loyaltyCardId);
}
