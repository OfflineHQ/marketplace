import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import { insertNftMintPasswords } from './action';
export interface CreateNftMintPasswordsProps
  extends Required<
    Pick<
      Parameters<typeof insertNftMintPasswords>[0][0],
      'contractAddress' | 'chainId'
    >
  > {
  amount: number;
}
export declare class ThirdwebOrganizerCommon {
  private sdk;
  constructor(sdk: ThirdwebSDK);
  getAddressAndChainId(): Promise<[string, number]>;
  setErc721ContractWithClaimConditions(
    contractAddress: string,
    maxAmount: number,
  ): Promise<{
    contract: import('@thirdweb-dev/sdk').SmartContract<ethers.BaseContract>;
    wallet: {
      address: string;
      privateKey: string;
    };
  }>;
  createNftMintPasswords({
    contractAddress,
    chainId,
    amount,
  }: CreateNftMintPasswordsProps): Promise<
    | {
        __typename?: 'nftMintPassword' | undefined;
        id: any;
        password: string;
        tokenId?: any;
        minterAddress?: string | null | undefined;
      }[]
    | undefined
  >;
}
