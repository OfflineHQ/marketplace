import { adminSdk } from '@gql/admin/api';
import {
  GetLoyaltyCardByContractAddressForProcessQuery,
  GetMinterTemporaryWalletByLoyaltyCardIdQuery,
} from '@gql/admin/types';
import { LoyaltyCardNft_Set_Input, NftStatus_Enum } from '@gql/shared/types';
import { NFTClaim } from './nftClaim';

export class LoyaltyCardNft extends NFTClaim {
  async updateLoyaltyCardNftsStatus(
    loyaltyCards: LoyaltyCardNft_Set_Input[], // Replace 'any' with the appropriate type
    status: NftStatus_Enum,
  ) {
    await adminSdk.UpdateLoyaltyCardNfts({
      updates: loyaltyCards.map((loyaltyCard) => ({
        _set: {
          status,
        },
        where: {
          id: {
            _eq: loyaltyCard.id,
          },
        },
      })),
    });
  }
  async multicallClaim(
    minterTemporaryWallet: GetMinterTemporaryWalletByLoyaltyCardIdQuery['minterTemporaryWallet'][0],
    loyaltyCards: GetLoyaltyCardByContractAddressForProcessQuery['loyaltyCardNft'],
  ) {
    if (loyaltyCards.length === 0 || !loyaltyCards[0].loyaltyCardId) {
      throw new Error('No loyaltyCards found or loyaltyCardId is undefined');
    }
    const contractAddress = loyaltyCards[0].contractAddress;
    const loyaltyCardId = loyaltyCards[0].loyaltyCardId;

    if (!contractAddress) {
      throw new Error(
        `ContractAddress is undefined for loyaltyCardId ${loyaltyCardId} and temporary wallet address ${minterTemporaryWallet.address}`,
      );
    }
    super.initializeSdk(minterTemporaryWallet);
    const contract = await this.sdk?.getContract(contractAddress);
    if (!contract) {
      throw new Error('Contract is undefined');
    }
    try {
      const encodedTransactions = await Promise.all(
        loyaltyCards.map(async (loyaltyCard) => {
          if (!loyaltyCard.ownerAddress) {
            throw new Error(
              `loyaltyCardNft ${loyaltyCard.id} does not have an associated owner.`,
            );
          }
          return contract
            .prepare('mintTo', [loyaltyCard.ownerAddress, loyaltyCard.metadata])
            .encode();
        }),
      );

      await contract.call('multicall', [encodedTransactions]);
      await this.updateLoyaltyCardNftsStatus(
        loyaltyCards,
        NftStatus_Enum.Completed,
      );
    } catch (e) {
      console.error(e);
      await this.updateLoyaltyCardNftsStatus(
        loyaltyCards,
        NftStatus_Enum.Error,
      );
    }
  }
}
