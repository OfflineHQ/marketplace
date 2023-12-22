'use server';
import { NftClaimable } from '@nft/thirdweb-admin';

export async function revealDelayedContract(contractAddress: string) {
  const sdk = new NftClaimable();
  await sdk.revealDelayedContract(contractAddress);
}
