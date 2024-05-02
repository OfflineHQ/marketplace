import { handler as processLoyaltyCardsMintHandler } from '@features/loyalty-card-cron';

export default async function handler() {
  try {
    const result = await processLoyaltyCardsMintHandler();
    console.log(
      'Minting process completed successfully for loyaltyCard:',
      result,
    );
    return result;
  } catch (error) {
    console.error('Error during the minting process for loyaltyCard:', error);
    throw error; // Re-throw the error if you want to propagate it further or handle it differently.
  }
}
