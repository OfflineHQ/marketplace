import { adminSdk } from '@gql/admin/api';
import {
  GetLoyaltyCardNftContractByContractAddressQueryVariables,
  GetLoyaltyCardOwnedByAddressQueryVariables,
} from '@gql/admin/types';
import { LoyaltyCardNft_Set_Input, NftStatus_Enum } from '@gql/shared/types';
import { BadRequestError, NotFoundError } from '@next/api-handler';
import { MintPasswordNftWrapper } from '@nft/mint-password';
import { NftMintPassword } from '@nft/types';

export type MintProps = GetLoyaltyCardOwnedByAddressQueryVariables;
export interface MintWithPasswordProps
  extends MintProps,
    Pick<NftMintPassword, 'password'> {}

export interface SetAsMintedProps
  extends GetLoyaltyCardOwnedByAddressQueryVariables,
    Required<Pick<LoyaltyCardNft_Set_Input, 'tokenId'>> {}

export class LoyaltyCardNftWrapper {
  private adminSdk: typeof adminSdk;
  private mintPasswordNftWrapper: MintPasswordNftWrapper;
  constructor() {
    this.adminSdk = adminSdk;
    this.mintPasswordNftWrapper = new MintPasswordNftWrapper();
  }
  async getLoyaltyCardOwnedByAddress(
    props: GetLoyaltyCardOwnedByAddressQueryVariables,
  ) {
    const res = await this.adminSdk.GetLoyaltyCardOwnedByAddress(props);
    return res.loyaltyCardNft?.[0];
  }
  async getLoyaltyCardNftContractByContractAddress(
    props: GetLoyaltyCardNftContractByContractAddressQueryVariables,
  ) {
    const res =
      await this.adminSdk.GetLoyaltyCardNftContractByContractAddress(props);
    return res.loyaltyCardNftContract?.[0];
  }
  async mint(props: MintProps) {
    const loyaltyCard = await this.getLoyaltyCardOwnedByAddress(props);
    if (
      loyaltyCard &&
      (loyaltyCard.status !== NftStatus_Enum.Burned ||
        loyaltyCard.burnedTransferId)
    ) {
      throw new BadRequestError('Loyalty card already minted');
    }
    const data = await this.getLoyaltyCardNftContractByContractAddress(props);
    if (!data) {
      throw new NotFoundError(
        'No loyalty card found for this contract address',
      );
    }
    const { loyaltyCardId } = data;
    await this.adminSdk.InsertLoyaltyCardNft({
      object: {
        loyaltyCardId,
        status: NftStatus_Enum.Confirmed,
        ...props,
      },
    });
  }
  async mintWithPassword({ password, ...props }: MintWithPasswordProps) {
    const loyaltyCard = await this.getLoyaltyCardOwnedByAddress(props);
    if (
      loyaltyCard &&
      (loyaltyCard.status !== NftStatus_Enum.Burned ||
        loyaltyCard.burnedTransferId)
    ) {
      throw new BadRequestError('Loyalty card already minted');
    }
    const nftMintPassword =
      await this.mintPasswordNftWrapper.evaluateNftMintPassword({
        ...props,
        password,
      });
    if (!nftMintPassword) {
      throw new BadRequestError('Invalid password');
    }
    const data = await this.getLoyaltyCardNftContractByContractAddress(props);
    if (!data) {
      throw new NotFoundError(
        'No loyalty card found for this contract address',
      );
    }
    const { loyaltyCardId } = data;
    await this.adminSdk.InsertLoyaltyCardNft({
      object: {
        loyaltyCardId,
        status: NftStatus_Enum.Confirmed,
        ...props,
      },
    });
    return this.mintPasswordNftWrapper.assignNftMintPasswordToMinter({
      id: nftMintPassword?.id,
      minterAddress: props.ownerAddress,
    });
  }
  async setAsMinted({ tokenId, ...props }: SetAsMintedProps) {
    const loyaltyCard = await this.getLoyaltyCardOwnedByAddress(props);
    if (!loyaltyCard) {
      throw new NotFoundError('No loyalty card found');
    }
    if (loyaltyCard.status !== NftStatus_Enum.Burned) {
      throw new BadRequestError('Loyalty card already burned');
    }
    return Promise.all([
      this.adminSdk.UpdateNftMintPasswordTokenId({
        ...props,
        minterAddress: props.ownerAddress,
        tokenId,
      }),
      this.adminSdk.UpdateLoyaltyCardNft({
        id: loyaltyCard?.id,
        object: { status: NftStatus_Enum.Completed, tokenId },
      }),
    ]);
  }
}
