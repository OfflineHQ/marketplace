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
  orders: EventPassOrderWithContractData[]
) => Promise<ClaimEventPassNftsMutation>;

async function checkOrder(order: EventPassOrderWithContractData) {
  if (!this.sdk) {
    throw new Error('SDK is undefined');
  }
  const contractAddress = order.eventPassNftContract?.contractAddress;
  const contract = await this.sdk.getContract(contractAddress);
  const supply = await contract.totalUnclaimedSupply();

  if (supply < order.quantity) {
    throw new Error(
      `Not enough supply for order ${order.id} : ${supply} remaining`
    );
  }
}

function sdkMiddleware(fn: FnType) {
  return async function (orders: EventPassOrderWithContractData[]) {
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }

    try {
      await Promise.all(orders.map((order) => checkOrder.call(this, order)));
    } catch (e) {
      console.error(e);
      throw new Error(`Error during check of the unclaim supply: ${e.message}`);
    }

    return await fn.call(this, orders);
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
              relayerUrl: env.NEXT_PUBLIC_OPENZEPPELIN_URL,
            },
          },
        }
      );
    } else {
      throw new Error('THIRDWEB_MASTER_PRIVATE_KEY is undefined');
    }
  }

  async startClaimPhase(
    contractAddress: string,
    phaseName: string,
    maxAmount: number
  ) {
    if (!this.sdk || env.THIRDWEB_MASTER_ADDRESS === undefined) {
      throw new Error('SDK is undefined');
    }
    const contract = await this.sdk.getContract(contractAddress);
    try {
      const txResult = await contract.erc721.claimConditions.set([
        {
          metadata: {
            name: phaseName,
          },
          startTime: new Date(),
          maxClaimablePerWallet: 0,
          snapshot: [
            {
              address: env.THIRDWEB_MASTER_ADDRESS as string,
              maxClaimable: maxAmount,
            },
          ],
        },
      ]);
      return txResult.receipt.transactionHash;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        throw new Error(`Error during contract operation: ${e.message}`);
      } else {
        throw e;
      }
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

  claimAllMetadatas = sdkMiddleware(async function (
    this: NftClaimable,
    orders: EventPassOrderWithContractData[]
  ): Promise<ClaimEventPassNftsMutation> {
    const promises = orders.map((order) => this.claimOrder(order));

    const claims = await Promise.allSettled(promises);

    const rejectedClaims = claims.filter(
      (claim) => claim.status === 'rejected'
    ) as PromiseRejectedResult[];

    if (rejectedClaims.length > 0) {
      for (const rejectedClaim of rejectedClaims) {
        console.error(`${rejectedClaim.reason}`);
      }
    }

    const fulfilledClaims = claims.filter(
      (claim) => claim.status === 'fulfilled'
    ) as PromiseFulfilledResult<
      {
        contractAddress: string;
        tokenId: number;
        currentOwnerAddress: string;
      }[]
    >[];

    return await this.registerOwnership({
      updates: fulfilledClaims.map((claim) => ({
        _set: { currentOwnerAddress: claim.value[0].currentOwnerAddress },
        where: {
          contractAddress: { _eq: claim.value[0].contractAddress },
          tokenId: { _eq: claim.value[0].tokenId },
        },
      })),
    });
  });

  private async claimOrder(order: EventPassOrderWithContractData) {
    const contractAddress = order.eventPassNftContract?.contractAddress;
    const toAddress = order.account?.address;
    if (!contractAddress || !toAddress) {
      throw new Error(
        `Contract address or to address is undefined for order ${order.id}`
      );
    }
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }
    const contract = await this.sdk.getContract(contractAddress);

    try {
      const claimResult = await contract.erc721.claimTo(
        toAddress,
        order.quantity
      );
      return claimResult.map((claim) => ({
        contractAddress: contractAddress,
        tokenId: claim.id.toNumber(),
        currentOwnerAddress: toAddress,
      }));
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
  }
}
