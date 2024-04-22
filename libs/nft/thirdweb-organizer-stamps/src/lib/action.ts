'use server';

import { adminSdk } from '@gql/admin/api';
import {
  StampNftContract_Insert_Input,
  StampNft_Insert_Input,
} from '@gql/shared/types';
import { ethers } from 'ethers';

export async function insertMinterTemporaryWallet(
  wallet: ethers.Wallet,
  campaignId: string,
) {
  try {
    const result = await adminSdk.InsertMinterTemporaryWallet({
      object: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        campaignId: campaignId,
      },
    });
    return result.insert_minterTemporaryWallet_one;
  } catch (error) {
    throw new Error(
      `Failed to insert minter temporary wallet: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
    );
  }
}

export async function createStampNftContract(
  input: StampNftContract_Insert_Input,
) {
  const data = await adminSdk.CreateStampNftContract({ input });
  return data?.insert_stampNftContract_one;
}

export async function createStampNfts(input: StampNft_Insert_Input[]) {
  const data = await adminSdk.InsertManyStampNfts({ input });
  return data?.insert_stampNft || null;
}
