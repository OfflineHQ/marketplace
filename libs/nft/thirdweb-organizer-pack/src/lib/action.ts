import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import { UpdateNftsWithPackIdMutationVariables } from '@gql/admin/types';
import {
  PackNftContract_Insert_Input,
  PackNftContractEventPass_Insert_Input,
} from '@gql/shared/types';
import { ContractType } from '@nft/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export async function createPackNftContract(
  object: PackNftContract_Insert_Input,
) {
  const data = await adminSdk.CreatePackNftContract({ object });
  return data?.insert_packNftContract_one;
}

export async function createPackNftContractEventPasses(
  objects: PackNftContractEventPass_Insert_Input[],
) {
  const data = await adminSdk.CreatePackNftContractEventPasses({ objects });
  return data?.insert_packNftContractEventPass || null;
}

export async function updateNftsWithPackId(
  updates: UpdateNftsWithPackIdMutationVariables,
) {
  const data = await adminSdk.UpdateNftsWithPackId(updates);
  return data?.update_eventPassNft_many;
}

export async function getUnopenedNftPackAmount(packId: string) {
  const packNftContract = (
    await adminSdk.GetPackNftContractFromPackId({
      packId: packId,
    })
  ).packNftContract;

  const nfts = packNftContract[0].eventPassNfts;
  const supply: Record<string, number> = {};

  for (const nft of nfts) {
    if (nft.currentOwnerAddress !== env.THIRDWEB_MASTER_ADDRESS) continue;
    if (supply[nft.eventPassId]) supply[nft.eventPassId] += 1;
    else supply[nft.eventPassId] = 1;
  }

  return supply;
}

export async function getPackSupply(contractAddress: string) {
  const sdk = new ThirdwebSDK(env.CHAIN);
  const pack = await sdk.getContract(contractAddress, ContractType.PACK);
  return pack.erc1155.totalSupply(0);
}
