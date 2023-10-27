import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type {
  ClaimEventPassNftsMutation,
  ClaimEventPassNftsMutationVariables,
} from '@gql/admin/types';
import { OrderStatus_Enum } from '@gql/shared/types';
import { EventPassOrderWithContractData } from '@nft/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

type FnType = (
  order: EventPassOrderWithContractData,
) => Promise<ClaimEventPassNftsMutation>;

function sdkMiddleware(fn: FnType) {
  return async function (order: EventPassOrderWithContractData) {
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }

    try {
      await this.checkOrder(order);
      console.log('wft');
    } catch (e) {
      console.error(e);
      throw new Error(`Error during check of the unclaim supply: ${e.message}`);
    }

    console.log('Calling the function now !!!!!');
    return await fn.call(this, order);
  };
}

export class NftClaimable {
  sdk?: ThirdwebSDK;

  constructor() {
    if (env.THIRDWEB_MASTER_PRIVATE_KEY) {
      this.sdk = ThirdwebSDK.fromPrivateKey(
        env.THIRDWEB_MASTER_PRIVATE_KEY as string,
        env.CHAIN,
        {
          secretKey: env.THIRDWEB_SECRET_KEY,
          gasless: {
            openzeppelin: {
              relayerUrl: env.OPENZEPPELIN_URL,
            },
          },
        },
      );
    } else {
      throw new Error('THIRDWEB_MASTER_PRIVATE_KEY is undefined');
    }
  }

  async checkOrder(order: EventPassOrderWithContractData) {
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }
    const contractAddress = order.eventPassNftContract?.contractAddress;
    console.log(order.eventPassNftContract);
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
    console.log('hihi');
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

  claimOrder = sdkMiddleware(async function (
    this: NftClaimable,
    order: EventPassOrderWithContractData,
  ): Promise<ClaimEventPassNftsMutation> {
    const contractAddress = order.eventPassNftContract?.contractAddress;
    const toAddress = order.account?.address;
    if (!contractAddress || !toAddress) {
      throw new Error(
        `Contract address or to address is undefined for order ${order.id}`,
      );
    }
    const contract = await this.sdk.getContract(contractAddress);

    try {
      console.log('Claim lol');
      const claimResult = await contract.erc721.claimTo(
        toAddress,
        order.quantity,
      );
      await adminSdk.UpdateEventPassOrdersStatus({
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
      await adminSdk.UpdateEventPassOrdersStatus({
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
  });
}
