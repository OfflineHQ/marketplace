import { handler as processLoyaltyCardsMintHandler } from '@features/loyalty-card-cron';

export default async function handler() {
  return await processLoyaltyCardsMintHandler();
}
