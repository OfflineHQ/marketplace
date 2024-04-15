'use client';

import { LoyaltyCardOrganizer } from '@features/back-office/loyalty-card-types';
import {
  GetLoyaltyCardByContractAddressForProcessQuery,
  GetMinterTemporaryWalletByLoyaltyCardIdQuery,
} from '@gql/admin/types';
import { NftStatus_Enum } from '@gql/shared/types';
import {
  ThirdwebOrganizerCommon,
  insertMinterTemporaryWallet,
} from '@nft/thirdweb-organizer-common';
import { NftsMetadata } from '@nft/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import {
  createLoyaltyCardContract,
  createLoyaltyCardParametersAndWebhook,
  createMinterSdk,
  updateLoyaltyCardNftsStatus,
} from './action';

export interface DeployLoyaltyCardContractProps
  extends Pick<LoyaltyCardOrganizer, 'id' | 'nftImage' | 'nftName'> {
  amount: number;
}
interface LoyaltyCardCommonProps extends DeployLoyaltyCardContractProps {
  address: string;
  chainId: string;
}
export class CollectionDeploymentError extends Error {
  constructor(error: Error) {
    super(`Error deploying a collection: ${error.message}`);
    this.name = 'LoyaltyCardCollectionDeploymentError';
  }
}

const maxNumberOfNfts = 50000; // TODO: changed later to a settable value, For now set to 50k NFTS by collection, can be changed later.

export class LoyaltyCardCollection {
  private sdk: ThirdwebSDK;
  thirdwebOrganizerCommon: ThirdwebOrganizerCommon;
  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
    this.thirdwebOrganizerCommon = new ThirdwebOrganizerCommon(sdk);
  }

  private async deployLoyaltyCardContractWithClaimCondition(
    props: LoyaltyCardCommonProps,
  ) {
    const { address, nftImage, nftName } = props;

    const metadata: NftsMetadata = {
      name: nftName,
      image: nftImage.url,
    };
    try {
      const contractAddress = await this.sdk.deployer.deployLoyaltyCard({
        name: nftName,
        primary_sale_recipient: address,
      });
      const { wallet } =
        await this.thirdwebOrganizerCommon.setErc721ContractWithClaimConditions(
          contractAddress,
          maxNumberOfNfts,
        );
      return {
        contractAddress: contractAddress.toLowerCase(),
        wallet,
      };
    } catch (error) {
      throw new CollectionDeploymentError(error);
    }
  }

  private async saveLoyaltyCardContractIntoDb({
    contractAddress,
    chainId,
    wallet,
    ...props
  }: DeployLoyaltyCardContractProps &
    Awaited<
      ReturnType<typeof this.deployLoyaltyCardContractWithClaimCondition>
    > & {
      chainId: string;
    }) {
    await createLoyaltyCardContract({
      loyaltyCardId: props.id,
      contractAddress,
      chainId,
    });
    await insertMinterTemporaryWallet({
      address: wallet.address,
      privateKey: wallet.privateKey,
      loyaltyCardId: props.id,
    });
    //TODOL: Add the webhook creation here for update of the loyalty card NFT metadata and assignation (minting) to the user.
    await createLoyaltyCardParametersAndWebhook({
      loyaltyCardId: props.id,
      contractAddress,
    });
    return this.thirdwebOrganizerCommon.createNftMintPasswords({
      contractAddress,
      chainId,
      amount: props.amount,
    });
  }

  async deployLoyaltyCardCollection(props: DeployLoyaltyCardContractProps) {
    const [address, chainIdNumber] =
      await this.thirdwebOrganizerCommon.getAddressAndChainId();
    const { contractAddress, wallet } =
      await this.deployLoyaltyCardContractWithClaimCondition({
        ...props,
        address,
        chainId: chainIdNumber.toString(),
      });
    return this.saveLoyaltyCardContractIntoDb({
      ...props,
      chainId: chainIdNumber.toString(),
      contractAddress,
      wallet,
    });
  }

  async multicallMint(
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
        `ContractAddress is undefined for eventPassId ${loyaltyCardId} and temporary wallet address ${minterTemporaryWallet.address}`,
      );
    }
    const minterSdk = await createMinterSdk(minterTemporaryWallet);

    const contract = await minterSdk.getContract(contractAddress);

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
      await updateLoyaltyCardNftsStatus(loyaltyCards, NftStatus_Enum.Completed);
    } catch (e) {
      console.error(e);
      await updateLoyaltyCardNftsStatus(loyaltyCards, NftStatus_Enum.Error);
    }
  }
}
