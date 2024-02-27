import env from '@env/server';
import { setOrdersToPending } from '@features/orders-cron';
import { adminSdk } from '@gql/admin/api';
import {
  ClaimEventPassNftsMutation,
  ClaimEventPassNftsMutationVariables,
  GetMinterTemporaryWalletByEventPassIdQuery,
  GetOrdersWithClaimInfoQuery,
} from '@gql/admin/types';
import { OrderStatus_Enum } from '@gql/shared/types';
import { NextRedis } from '@next/redis';
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
    const minterSdk = ThirdwebSDK.fromPrivateKey(
      minterTemporaryWallet.privateKey,
      convertChainIdToThirdwebChain(env.CHAIN),
      {
        secretKey: env.THIRDWEB_SECRET_KEY,
        gasless: {
          openzeppelin: {
            relayerUrl: env.OPENZEPPELIN_URL,
          },
        },
      },
    );

    const contract = await minterSdk.getContract(contractAddress);

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
