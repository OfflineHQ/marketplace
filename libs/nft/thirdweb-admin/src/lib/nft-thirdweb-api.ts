import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import {
  ClaimEventPassNftsMutation,
  ClaimEventPassNftsMutationVariables,
} from '@gql/admin/types';
import { OrderStatus_Enum } from '@gql/shared/types';
import { OrderWithContractData } from '@nft/types';
import {
  Ethereum,
  Goerli,
  Mumbai,
  Polygon,
  Sepolia,
} from '@thirdweb-dev/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

function convertChainIdToThirdwebChain(chainId: string) {
  switch (chainId) {
    case '1':
      return Ethereum;
    case '5':
      return Goerli;
    case '11155111':
      return Sepolia;
    case '80001':
      return Mumbai;
    case '137':
      return Polygon;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}

export class NftClaimable {
  sdk?: ThirdwebSDK;

  constructor() {
    try {
      this.sdk = ThirdwebSDK.fromPrivateKey(
        env.THIRDWEB_MASTER_PRIVATE_KEY,
        convertChainIdToThirdwebChain(env.CHAIN),
        {
          secretKey: env.THIRDWEB_SECRET_KEY,
        },
      );
    } catch (error) {
      console.error(`Error initializing ThirdwebSDK: ${error.message}`);
      throw error;
    }
  }

  async checkOrder(order: OrderWithContractData) {
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }
    const contractAddress = order.eventPassNftContract?.contractAddress;
    if (!contractAddress) {
      throw new Error('Contract address is undefined');
    }
    const contract = await this.sdk.getContract(contractAddress);

    if (!(await contract.erc721.claimConditions.canClaim(order.quantity))) {
      const reasons =
        await contract.erc721.claimConditions.getClaimIneligibilityReasons(
          order.quantity,
        );
      throw new Error(
        `Cannot claim for order ${order.id} with reasons : ${reasons}`,
      );
    }
  }

  async registerOwnership(updateData: ClaimEventPassNftsMutationVariables) {
    try {
      return await adminSdk.ClaimEventPassNfts(updateData);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error registering ownership: ${error.message}`);
        throw error;
      } else {
        throw error;
      }
    }
  }

  async claimOrder(
    this: NftClaimable,
    order: OrderWithContractData,
  ): Promise<ClaimEventPassNftsMutation> {
    const contractAddress = order.eventPassNftContract?.contractAddress;
    const toAddress = order.account?.address;
    if (!contractAddress || !toAddress) {
      throw new Error(
        `Contract address or to address is undefined for order ${order.id}`,
      );
    }
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }
    const contract = await this.sdk.getContract(contractAddress);

    try {
      const claimResult = await contract.erc721.claimTo(
        toAddress,
        order.quantity,
      );
      await adminSdk.UpdateOrdersStatus({
        updates: [
          {
            _set: {
              status: OrderStatus_Enum.Completed,
            },
            where: {
              id: {
                _eq: order.id,
              },
            },
          },
        ],
      });
      return await this.registerOwnership({
        updates: claimResult.map((claim) => ({
          _set: { currentOwnerAddress: toAddress },
          where: {
            contractAddress: { _eq: contractAddress },
            tokenId: { _eq: claim.id.toNumber() },
          },
        })),
      });
    } catch (e) {
      await adminSdk.UpdateOrdersStatus({
        updates: [
          {
            _set: {
              status: OrderStatus_Enum.Error,
            },
            where: {
              id: {
                _eq: order.id,
              },
            },
          },
        ],
      });
      console.error(e);
      throw new Error(`Error during claiming operation: ${e.message}`);
    }
  }
}
