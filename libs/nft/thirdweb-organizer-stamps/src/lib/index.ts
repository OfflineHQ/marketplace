import { adminSdk } from '@gql/admin/api';
import { StampNftContractType_Enum } from '@gql/shared/types';
import { getCurrentChain } from '@next/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import {
  createStampNftContract,
  createStampNfts,
  insertMinterTemporaryWallet,
} from './action.js';

interface Product {
  name: string;
  shopify_product_id: string;
  shopify_product_variant_id: string | null;
}

interface CampaignData {
  name: string;
  minterTemporaryWallet: ethers.Wallet;
  campaignId: string;
  organizerId: string;
  products: Product[];
  gatesId: string;
}

export interface CampaignBody {
  campaignId: string;
  pairings: {
    productId: string;
    customersIds: string[];
  }[];
}

export class StampsCollection {
  private sdk: ThirdwebSDK;

  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
  }

  private async deployContract(wallet: ethers.Wallet, campaignId: string) {
    const contractAddress = await this.sdk.deployer.deployEditionDrop({
      name: campaignId,
      primary_sale_recipient: wallet.address,
    });
    return contractAddress.toLowerCase();
  }

  private async registerContract(
    contractAddress: string,
    organizerId: string,
    campaignId: string,
  ) {
    await createStampNftContract({
      type: StampNftContractType_Enum.ShopifyPurchaseCompleted,
      contractAddress,
      chainId: getCurrentChain().chainIdHex,
      campaignId,
      organizerId,
    });
  }

  public async mintNFT(
    contractAddress: string,
    productId: string,
    supplyAmount: number,
  ) {
    const editionDrop = await this.sdk.getContract(contractAddress);
    const metadata = {
      name: `NFT for product ${productId}`,
      description: 'Exclusive NFT linked to a product purchase',
    };
    const result = await editionDrop.erc1155.mint({
      supply: supplyAmount,
      metadata,
    });
    return result.id.toString();
  }

  public async airdropNFT(
    contractAddress: string,
    tokenId: string,
    recipientAddress: string[],
  ) {
    const editionDrop = await this.sdk.getContract(contractAddress);
    await editionDrop.erc1155.airdrop(tokenId, recipientAddress);
  }

  private async handlePairings(
    contractAddress: string,
    organizerId: string,
    pairings: CampaignBody['pairings'],
  ) {
    const allNftData = [];

    for (const pairing of pairings) {
      const recipientAddresses = await this.getRecipientAddresses(
        organizerId,
        pairing.customersIds,
      );
      const supply = recipientAddresses.length;
      const tokenId = await this.mintNFT(
        contractAddress,
        pairing.productId,
        supply,
      );

      allNftData.push({
        contractAddress,
        tokenId,
        metadata: JSON.stringify({
          name: `NFT for product ${pairing.productId}`,
        }),
        chainId: getCurrentChain().chainIdHex,
        supply,
      });

      await this.airdropNFT(contractAddress, tokenId, recipientAddresses);
    }

    return allNftData;
  }

  public async getRecipientAddresses(
    organizerId: string,
    customerIds: string[],
  ) {
    const response = await adminSdk.GetShopifyCustomers({
      organizerId,
      customerIds,
    });
    return response.shopifyCustomer.map((customer) => customer.address);
  }

  public async processCampaign(
    organizerId: string,
    wallet: ethers.Wallet,
    body: CampaignBody,
  ) {
    if (body.pairings.length === 0) {
      throw new Error('No pairings provided');
    }
    try {
      const contractAddress = await this.deployContract(
        wallet,
        body.campaignId,
      );
      await this.registerContract(
        contractAddress,
        organizerId,
        body.campaignId,
      );

      const allNftData = await this.handlePairings(
        contractAddress,
        organizerId,
        body.pairings,
      );
      await createStampNfts(allNftData);
      await insertMinterTemporaryWallet(wallet, body.campaignId);
      console.log('Lol ça crash');
      return contractAddress;
    } catch (error) {
      console.error('Failed to process campaign:', error);
      throw error;
    }
  }
}
