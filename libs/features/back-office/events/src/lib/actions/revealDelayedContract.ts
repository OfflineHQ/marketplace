'use server';
import { NftClaimable } from '@nft/thirdweb-admin';

export async function revealDelayedContract(contractAddress: string) {
  if (!contractAddress) {
    throw new Error('Contract address is undefined');
  }
  const sdk = new NftClaimable();
  await sdk.revealDelayedContract(contractAddress);
}
