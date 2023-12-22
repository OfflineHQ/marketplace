import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import {
  ClaimEventPassNftsMutation,
  ClaimEventPassNftsMutationVariables,
} from '@gql/admin/types';
import {
  EventPassNftContractType_Enum,
  OrderStatus_Enum,
} from '@gql/shared/types';
import { EventPassOrderWithContractData } from '@nft/types';
import { Ethereum, Goerli, Sepolia } from '@thirdweb-dev/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

function convertChainIdToThirdwebChain(chainId: string) {
  switch (chainId) {
    case '1':
      return Ethereum;
    case '5':
      return Goerli;
    case '11155111':
      return Sepolia;
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

  async checkOrder(order: EventPassOrderWithContractData) {
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

  async revealDelayedContract(contractAddress: string) {
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }

    try {
      const res = await adminSdk.GetEventPassNftContractDelayedRevealPassword({
        contractAddress,
      });
      const eventPassNftContract = res?.eventPassNftContract?.[0];

      if (!eventPassNftContract) {
        throw new Error(
          `Event pass NFT contract for address ${contractAddress} not found.`,
        );
      }
      if (
        eventPassNftContract.type !==
          EventPassNftContractType_Enum.DelayedReveal ||
        eventPassNftContract.isDelayedRevealed ||
        !eventPassNftContract.password
      ) {
        throw new Error(
          `Event pass NFT contract for address ${contractAddress} does not meet the required conditions for reveal.`,
        );
      }
      const contract = await this.sdk.getContract(contractAddress);

      await contract.erc721.revealer.reveal(0, eventPassNftContract.password);

      await adminSdk.UpdateEventPassNftContractDelayedRevealStatus({
        contractAddress,
      });

      return adminSdk.GetListCurrentOwnerAddressForContractAddress({
        contractAddress,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error revealing the delayed contract at address ${contractAddress} : ${error.message}`,
        );
      } else
        throw new Error(
          `Error revealing the delayed contract at address ${contractAddress} : ${error}`,
        );
    }
  }

  async claimOrder(
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
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }
    const contract = await this.sdk.getContract(contractAddress);

    try {
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
  }
}
