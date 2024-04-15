import { setOrdersToPending } from '@features/orders-cron';
import { adminSdk } from '@gql/admin/api';
import {
  ClaimEventPassNftsMutationVariables,
  GetMinterTemporaryWalletByEventPassIdQuery,
  GetOrdersWithClaimInfoQuery,
} from '@gql/admin/types';
import { OrderStatus_Enum } from '@gql/shared/types';
import { NextRedis } from '@next/redis';
import { OrderWithContractData } from '@nft/types';
import { NFTClaim } from './nftClaim';

export class EventPassNftOrder extends NFTClaim {
  async checkOrder(order: OrderWithContractData) {
    super.initializeSdkFromMasterWallet();
    const contractAddress = order.eventPassNftContract?.contractAddress;
    if (!contractAddress) {
      throw new Error('Contract address is undefined');
    }
    const contract = await this.sdk?.getContract(contractAddress);
    if (!contract) {
      throw new Error('Contract is undefined');
    }

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

  async multicallClaim(
    minterTemporaryWallet: GetMinterTemporaryWalletByEventPassIdQuery['minterTemporaryWallet'][0],
    orders: GetOrdersWithClaimInfoQuery['order'],
  ) {
    if (
      orders.length === 0 ||
      !orders[0].eventPassNftContract ||
      !orders[0].eventPassId
    ) {
      throw new Error('No orders found or eventPassNftContract is undefined');
    }
    const contractAddress = orders[0].eventPassNftContract.contractAddress;
    const eventPassId = orders[0].eventPassId;

    if (!contractAddress) {
      throw new Error(
        `ContractAddress is undefined for eventPassId ${orders[0].eventPassId} and temporary wallet address ${minterTemporaryWallet.address}`,
      );
    }
    super.initializeSdk(minterTemporaryWallet);
    const contract = await this.sdk?.getContract(contractAddress);
    if (!contract) {
      throw new Error('Contract is undefined');
    }

    try {
      const encodedTransactions = await Promise.all(
        orders.map(async (order) => {
          if (!order.account) {
            throw new Error(
              `Order ${order.id} does not have an associated account.`,
            );
          }
          return contract
            .prepare('claimTo', [order.account.address, order.quantity])
            .encode();
        }),
      );

      await contract.call('multicall', [encodedTransactions]);
    } catch (e) {
      console.error(e);
      await setOrdersToPending(
        new NextRedis(),
        eventPassId,
        orders.map((order) => order.id),
      );
      return;
    }
    try {
      await adminSdk.UpdateOrdersStatus({
        updates: orders.map((order) => ({
          _set: {
            status: OrderStatus_Enum.Completed,
          },
          where: {
            id: {
              _eq: order.id,
            },
          },
        })),
      });
    } catch (e) {
      console.error(e);
      await adminSdk.UpdateOrdersStatus({
        updates: orders.map((order) => ({
          _set: {
            status: OrderStatus_Enum.Error,
          },
          where: {
            id: {
              _eq: order.id,
            },
          },
        })),
      });
    }
  }
}
