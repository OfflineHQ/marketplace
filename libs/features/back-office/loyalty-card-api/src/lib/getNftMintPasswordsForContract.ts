'use server';

import { adminSdk } from '@gql/admin/api';
import { GetNftMintPasswordsForContractQueryVariables } from '@gql/admin/types';
import { revalidateTag } from 'next/cache';

export async function getNftMintPasswordsForContract({
  contractAddress,
  chainId,
}: GetNftMintPasswordsForContractQueryVariables) {
  const data = await adminSdk.GetNftMintPasswordsForContract(
    {
      contractAddress,
      chainId,
    },
    {
      next: {
        tags: [`${contractAddress}-${chainId}-getNftMintPasswordsForContract`],
      },
    },
  );
  return data?.nftMintPassword;
}

export const resetNftMintPasswordsForContract = async ({
  contractAddress,
  chainId,
}: GetNftMintPasswordsForContractQueryVariables) => {
  return revalidateTag(
    `${contractAddress}-${chainId}-getNftMintPasswordsForContract`,
  );
};
