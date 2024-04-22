'use server';

import { adminSdk } from '@gql/admin/api';
import type { InsertMinterTemporaryWalletMutation } from '@gql/admin/types';
import type {
  MinterTemporaryWallet_Insert_Input,
  NftMintPassword_Insert_Input,
} from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';

export async function insertMinterTemporaryWallet(
  object: MinterTemporaryWallet_Insert_Input,
): Promise<
  InsertMinterTemporaryWalletMutation['insert_minterTemporaryWallet_one']
> {
  const data = await adminSdk.InsertMinterTemporaryWallet({ object });
  return data?.insert_minterTemporaryWallet_one;
}

export async function insertMinterTemporaryWallets(
  objects: MinterTemporaryWallet_Insert_Input[],
) {
  const data = await adminSdk.InsertMinterTemporaryWallets({ objects });
  return data?.insert_minterTemporaryWallet || null;
}

export async function insertNftMintPasswords(
  objects: Omit<NftMintPassword_Insert_Input, 'organizerId'>[],
) {
  const user = await getCurrentUser();
  if (!user || !user.role?.organizerId)
    throw new Error('No user role found for organizer');
  else {
    const data = await adminSdk.InsertNftMintPasswords({
      objects: objects.map((object) => ({
        ...object,
        organizerId: user.role?.organizerId,
      })),
    });
    return data?.insert_nftMintPassword || null;
  }
}

export async function getNftMintPasswords({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: string;
}) {
  const data = await adminSdk.GetNftMintPasswordsForContract({
    contractAddress,
    chainId,
  });
  return data?.nftMintPassword;
}
