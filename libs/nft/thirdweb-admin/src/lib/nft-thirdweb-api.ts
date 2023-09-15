'use server';

import { adminSdk } from '@gql/admin/api';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import type {
  ClaimEventPassNftsMutation,
  ClaimEventPassNftsMutationVariables,
} from '@gql/admin/types';
import { EventPassOrder, OrderStatus_Enum } from '@gql/shared/types';

export type RequiredOrderKeys = {
  id: EventPassOrder['id'];
  quantity: EventPassOrder['quantity'];
  account: {
    address: EventPassOrder['account']['address'];
  };
  eventPass: {
    eventPassNftContract: {
      contractAddress: EventPassOrder['eventPass']['eventPassNftContract']['contractAddress'];
    };
  };
};

type FnType = (
  orders: RequiredOrderKeys[]
) => Promise<ClaimEventPassNftsMutation>;

async function checkOrder(order: RequiredOrderKeys) {
  const contractAddress = order.eventPass.eventPassNftContract.contractAddress;
  const contract = await this.sdk.getContract(contractAddress);
  const supply = await contract.totalUnclaimedSupply();

  if (supply < order.quantity) {
    throw new Error(
      `Not enough supply for order ${order.id} : ${supply} remaining`
    );
  }
}

function sdkMiddleware(fn: FnType) {
  return async function (orders: RequiredOrderKeys[]) {
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

class NftClaimable {
  sdk?: ThirdwebSDK;

  constructor() {
    if (process.env['THIRDWEB_MASTER_PRIVATE_KEY'] !== undefined) {
      this.sdk = ThirdwebSDK.fromPrivateKey(
        process.env['THIRDWEB_MASTER_PRIVATE_KEY'] as string,
        'goerli',
        {
          secretKey: process.env['THIRDWEB_SECRET_KEY'],
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
    if (!this.sdk || process.env['THIRDWEB_MASTER_ADDRESS'] === undefined) {
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
              address: process.env['THIRDWEB_MASTER_ADDRESS'] as string,
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
    orders: RequiredOrderKeys[]
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

  private async claimOrder(order: RequiredOrderKeys) {
    const contractAddress =
      order.eventPass.eventPassNftContract.contractAddress;
    const toAddress = order.account.address;
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
      await adminSdk.UpsertEventPassOrders({
        objects: [
          {
            id: order.id,
            status: OrderStatus_Enum.Error,
          },
        ],
      });
      console.error(e);
      throw new Error(`Error during claiming operation: ${e.message}`);
    }
  }
}

export default NftClaimable;
