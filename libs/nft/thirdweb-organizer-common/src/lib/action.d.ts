import type { InsertMinterTemporaryWalletMutation } from '@gql/admin/types';
import type {
  MinterTemporaryWallet_Insert_Input,
  NftMintPassword_Insert_Input,
} from '@gql/shared/types';
export declare function insertMinterTemporaryWallet(
  object: MinterTemporaryWallet_Insert_Input,
): Promise<
  InsertMinterTemporaryWalletMutation['insert_minterTemporaryWallet_one']
>;
export declare function insertMinterTemporaryWallets(
  objects: MinterTemporaryWallet_Insert_Input[],
): Promise<{
  __typename?: 'minterTemporaryWallet_mutation_response' | undefined;
  affected_rows: number;
  returning: {
    __typename?: 'minterTemporaryWallet' | undefined;
    address: string;
    eventPassId?: string | null | undefined;
    packId?: string | null | undefined;
    loyaltyCardId?: string | null | undefined;
    campaignId?: string | null | undefined;
  }[];
} | null>;
export declare function insertNftMintPasswords(
  objects: Omit<NftMintPassword_Insert_Input, 'organizerId'>[],
): Promise<{
  __typename?: 'nftMintPassword_mutation_response' | undefined;
  affected_rows: number;
  returning: {
    __typename?: 'nftMintPassword' | undefined;
    id: any;
    password: string;
    tokenId?: any;
    minterAddress?: string | null | undefined;
  }[];
} | null>;
export declare function getNftMintPasswords({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: string;
}): Promise<
  {
    __typename?: 'nftMintPassword' | undefined;
    password: string;
    minterAddress?: string | null | undefined;
    created_at: any;
    updated_at: any;
  }[]
>;
