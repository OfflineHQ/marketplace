import { NftStatus_Enum } from '@gql/shared/types';
import { ThirdwebOrganizerCommon } from '@nft/thirdweb-organizer-common';
import {
  EventPassCollection,
  getEventPassNftContractNftsLazyMinted,
} from '@nft/thirdweb-organizer-event-pass';
import { ContractType, EventPassNftContractNftsLazyMinted } from '@nft/types';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import {
  createPackNftContract,
  createPackNftContractEventPasses,
  updateNftsWithPackId,
} from './action';

type SavePackContractIntoDbProps = {
  chainIdNumber: number;
  pack: Pack;
  txResult: string;
  selectedNfts: EventPassNftContractNftsLazyMinted;
};

type DeployAndCreatePackProps = {
  pack: Pack;
  address: string;
  selectedNfts: EventPassNftContractNftsLazyMinted;
  approvalData: {
    contractAddress: string;
    eventPassId: string;
  }[];
};

//TODO: get types from @nft/types and pick from PackNftContract from @gql/shared/types
// + should separate what's coming from Hygraph (name, image, etc) and the settings for the pack contract (rewardsPerPack, etc)
type Pack = {
  id: string;
  name: string;
  image: string;
  organizerId: string;
  lotteryId: string;
  eventPassIds: {
    id: string;
    amount: number;
  }[];
  rewardsPerPack?: number;
};

class PackDeploymentError extends Error {
  constructor(error: Error) {
    super(`Error deploying a pack: ${error.message}`);
    this.name = 'PackDeploymentError';
  }
}

export class PackCollection {
  private sdk: ThirdwebSDK;
  private eventPassCollection: EventPassCollection;
  thirdwebOrganizerCommon: ThirdwebOrganizerCommon;

  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
    this.eventPassCollection = new EventPassCollection(sdk);
    this.thirdwebOrganizerCommon = new ThirdwebOrganizerCommon(sdk);
  }

  async savePackContractIntoDb(props: SavePackContractIntoDbProps) {
    const { chainIdNumber, pack, txResult, selectedNfts } = props;
    const {
      id: packId,
      rewardsPerPack,
      eventPassIds,
      organizerId,
      lotteryId,
    } = pack;
    const packNftContract = await createPackNftContract({
      chainId: chainIdNumber.toString(),
      ...(rewardsPerPack !== undefined && {
        rewardsPerPack,
      }),
      organizerId,
      packId,
      lotteryId,
      contractAddress: txResult,
    });
    if (!packNftContract) throw new Error('Error creating packNftContract');

    await createPackNftContractEventPasses(
      eventPassIds.map((eventPass) => ({
        packNftContractId: packNftContract.id,
        eventPassId: eventPass.id,
        amount: eventPass.amount,
      })),
    );

    const updates = selectedNfts.map((nft) => {
      return {
        _set: {
          packId: packNftContract.packId,
          status: NftStatus_Enum.HeldByContract,
        },
        where: {
          contractAddress: { _eq: nft.contractAddress },
          tokenId: { _eq: nft.tokenId },
        },
      };
    });
    await updateNftsWithPackId({ updates });
  }

  async deployAndCreatePack(props: DeployAndCreatePackProps): Promise<string> {
    const { pack, address, selectedNfts, approvalData } = props;

    const contractAddress = await this.sdk.deployer.deployBuiltInContract(
      ContractType.PACK,
      {
        name: pack.name,
        primary_sale_recipient: address,
        platform_fee_recipient: address,
        voting_token_address: address,
      },
    );

    const txResult = contractAddress.toLowerCase();

    for (const data of approvalData) {
      const eventPassContract = await this.sdk.getContract(
        data.contractAddress,
      );

      const eventPass = pack.eventPassIds.find(
        (eventPass) => eventPass.id === data.eventPassId,
      );

      if (!eventPass) {
        throw new Error(`No event pass found with id ${data.eventPassId}`);
      }

      const amount = eventPass.amount;

      await eventPassContract.erc721.claimTo(address, amount);
      await eventPassContract.erc721.setApprovalForAll(txResult, true);
    }

    const contract = await this.sdk.getContract(txResult, ContractType.PACK);

    const erc721Rewards = selectedNfts.map((nft) => ({
      contractAddress: nft.contractAddress,
      tokenId: nft.tokenId,
    }));

    const packData = {
      packMetadata: {
        name: pack.name,
        image: pack.image,
      },
      erc721Rewards: erc721Rewards,
      ...(pack.rewardsPerPack !== undefined && {
        rewardsPerPack: pack.rewardsPerPack,
      }),
    };

    await contract.create(packData);

    return txResult;
  }

  async getSelectedNftsFromPack(pack: Pack) {
    const eventPassNftContracts = await Promise.all(
      pack.eventPassIds.map((eventPass) =>
        getEventPassNftContractNftsLazyMinted({ eventPassId: eventPass.id }),
      ),
    );

    const allEventPassNfts = <EventPassNftContractNftsLazyMinted>(
      eventPassNftContracts.flatMap((contract) => {
        // ...
        if (!contract) {
          throw new Error(
            "One of your eventPassId doesn't have an eventPassNftContract",
          );
        }
        return contract.eventPassNfts.filter(
          (nft) =>
            nft.status === NftStatus_Enum.LazyMinted &&
            nft.tokenId !== undefined,
        );
      })
    );

    const selectedNfts: EventPassNftContractNftsLazyMinted = [];
    const approvalData = eventPassNftContracts.map((contract) => ({
      contractAddress: contract.contractAddress,
      eventPassId: contract.eventPassId,
    }));

    for (const eventPass of pack.eventPassIds) {
      const requiredAmount = eventPass.amount;
      const availableNfts: EventPassNftContractNftsLazyMinted =
        allEventPassNfts.filter(
          (nft) => nft.eventPassId === eventPass.id && !nft.currentOwnerAddress,
        );

      if (availableNfts.length < requiredAmount) {
        throw new Error(
          `Not enough available NFTs for eventPassId ${eventPass.id}`,
        );
      }

      const selectedNftsForCurrentPass = availableNfts.slice(0, requiredAmount);
      selectedNfts.push(...selectedNftsForCurrentPass);
    }

    return { selectedNfts, approvalData };
  }

  private validateDeployAPackInputs(pack: Pack) {
    const requiredFields = [
      'id',
      'name',
      'image',
      'eventPassIds',
      'lotteryId',
      'organizerId',
    ];

    for (const field of requiredFields) {
      if (!pack[field]) {
        throw new Error(`Missing required field in pack: ${field}`);
      }
    }
    pack.eventPassIds.forEach((eventPassId, index) => {
      if (!eventPassId.id || !eventPassId.amount || eventPassId.amount <= 0) {
        throw new Error(
          `Missing required field in eventPassIds at index ${index}: id or amount`,
        );
      }
    });
  }

  async deployAPack(pack: Pack) {
    try {
      this.validateDeployAPackInputs(pack);

      const { selectedNfts, approvalData } =
        await this.getSelectedNftsFromPack(pack);

      const [address, chainIdNumber] =
        await this.thirdwebOrganizerCommon.getAddressAndChainId();

      const txResult = await this.deployAndCreatePack({
        address,
        pack,
        selectedNfts,
        approvalData,
      });

      await this.savePackContractIntoDb({
        txResult,
        selectedNfts,
        pack,
        chainIdNumber,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new PackDeploymentError(error);
      } else console.error(error);
    }
  }
}
