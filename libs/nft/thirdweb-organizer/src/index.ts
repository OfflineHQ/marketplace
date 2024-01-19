'use client';

import env from '@env/client';
import {
  EventPass,
  EventPassDelayedRevealed,
} from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import {
  ContractType,
  EventPassNftContractNfts,
  EventPassNftContractObject,
  EventSmallData,
  NftsMetadata,
  RequiredEventPassNft,
} from '@nft/types';
import { ThirdwebSDK, TransactionResultWithId } from '@thirdweb-dev/sdk';
import * as crypto from 'crypto';
import { ethers } from 'ethers';
import {
  createEventParametersAndWebhook,
  createEventPassNftContract,
  createEventPassNfts,
  createPackNftContract,
  createPackNftContractEventPasses,
  getEventPassNftContractNfts,
  updateNftsWithPackId,
} from './action';

interface CommonProps extends EventPass, EventSmallData {
  address: string;
  chainId: string;
}
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

type SaveEventPassContractIntoDbProps = {
  props: CommonProps;
  txResult: string;
  baseUri: string;
  results: TransactionResultWithId[];
  metadatas: NftsMetadata[];
  object: EventPassNftContractObject;
};

type SavePackContractIntoDbProps = {
  chainIdNumber: number;
  pack: Pack;
  txResult: string;
  selectedNfts: RequiredEventPassNft[];
};

type DeployAndCreatePackProps = {
  pack: Pack;
  address: string;
  selectedNfts: RequiredEventPassNft[];
  approvalData: {
    contractAddress: string;
    eventPassId: string;
  }[];
};

const BASE_URL = 'https://www.offline.live/pass/organizer/';

class CollectionDeploymentError extends Error {
  constructor(error: Error) {
    super(`Error deploying a collection: ${error.message}`);
    this.name = 'CollectionDeploymentError';
  }
}

class PackDeploymentError extends Error {
  constructor(error: Error) {
    super(`Error deploying a pack: ${error.message}`);
    this.name = 'PackDeploymentError';
  }
}

export class NftCollection {
  private sdk: ThirdwebSDK;

  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
  }

  async getAddressAndChainId(): Promise<[string, number]> {
    const [address, chainIdNumber] = await Promise.all([
      this.sdk.wallet.getAddress(),
      this.sdk.wallet.getChainId(),
    ]);

    return [address, chainIdNumber];
  }

  async getCommonProps(
    props: EventPass,
    eventData: EventSmallData,
  ): Promise<CommonProps> {
    const [address, chainIdNumber] = await this.getAddressAndChainId();
    const chainId = chainIdNumber.toString();

    return {
      ...props,
      ...eventData,
      address,
      chainId,
    };
  }

  async deployACollection(
    eventPass: EventPass,
    eventData: EventSmallData,
    type: EventPassNftContractType_Enum,
  ) {
    try {
      const commonProps = await this.getCommonProps(eventPass, eventData);

      this.validateDeployInputs(commonProps);

      switch (type) {
        case EventPassNftContractType_Enum.Normal:
          await this.deployAnNftDropCollection(commonProps);
          break;
        case EventPassNftContractType_Enum.DelayedReveal:
          await this.deployDelayedRevealCollection(commonProps);
          break;
        default:
          throw new CollectionDeploymentError(
            new Error(
              `The type argument '${type}' is not in the EventPassNftContractType_Enum`,
            ),
          );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new CollectionDeploymentError(error);
      } else console.error(error);
    }
  }

  private async getContractWithClaimConditions(
    txResult: string,
    maxAmount: number,
  ) {
    const contract = await this.sdk.getContract(txResult);

    await contract.erc721.claimConditions.set([
      {
        metadata: {
          name: 'Phase de claim',
        },
        startTime: new Date(),
        maxClaimablePerWallet: 0,
        snapshot: [
          {
            address: env.NEXT_PUBLIC_THIRDWEB_MASTER_ADDRESS,
            maxClaimable: maxAmount,
          },
        ],
      },
    ]);

    return contract;
  }

  createMetadatas(
    maxAmount: number,
    metadata: NftsMetadata,
    organizerId: string,
    eventId: string,
    eventPassId: string,
  ): NftsMetadata[] {
    return [...Array(maxAmount)].map((_, i): NftsMetadata => {
      return {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        external_url: `${BASE_URL}${organizerId}/event/${eventId}/eventPass/${eventPassId}/${i}`,
      };
    });
  }

  async createHasuraMetadatas(
    metadatas: NftsMetadata[],
    results: TransactionResultWithId[],
    baseUri: string,
    chainId: string,
    organizerId: string,
    eventId: string,
    eventPassId: string,
    txResult: string,
  ) {
    return await Promise.all(
      metadatas.map(async (metadata, i) => {
        const tokenIdInBigNumber = results[i].id;
        const tokenId = ethers.BigNumber.from(tokenIdInBigNumber).toNumber();
        const tokenUri = `${baseUri}${tokenId}`;
        return {
          metadata,
          chainId,
          tokenId,
          tokenUri,
          organizerId,
          eventId,
          eventPassId,
          contractAddress: txResult,
        };
      }),
    );
  }

  private validateDeployInputs(props: CommonProps) {
    const requiredFields = [
      'name',
      'address',
      'id',
      'chainId',
      'eventId',
      'organizerId',
      'eventSlug',
      'nftImage',
      'nftDescription',
      'nftName',
      'passAmount',
    ];

    for (const field of requiredFields) {
      if (!props[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!props.passAmount?.maxAmount) {
      throw new Error('Missing required field: passAmount.maxAmount');
    }
  }

  async deployDropContractAndPrepareMetadata(props: CommonProps) {
    const {
      name,
      address,
      id: eventPassId,
      eventId,
      organizerId,
      nftImage,
      nftDescription,
      nftName,
      passAmount,
    } = props;

    const metadata: NftsMetadata = {
      name: nftName,
      description: nftDescription,
      image: nftImage.url,
    };

    if (!passAmount?.maxAmount) {
      throw new Error('Missing amount for eventPass');
    }
    const { maxAmount } = passAmount;

    try {
      const txResult = await this.sdk.deployer.deployBuiltInContract(
        ContractType.NFT_DROP,
        {
          name,
          primary_sale_recipient: address,
          platform_fee_recipient: address,
          voting_token_address: address,
        },
      );

      const contract = await this.getContractWithClaimConditions(
        txResult,
        maxAmount,
      );

      const metadatas = this.createMetadatas(
        maxAmount,
        metadata,
        organizerId,
        eventId,
        eventPassId,
      );

      return { contract, metadatas };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deploying a drop contract : ${error.message}`);
      } else throw new Error(error);
    }
  }

  async saveEventPassContractIntoDb({
    props,
    txResult,
    baseUri,
    results,
    metadatas,
    object,
  }: SaveEventPassContractIntoDbProps) {
    try {
      const {
        id: eventPassId,
        chainId,
        eventId,
        organizerId,
        eventSlug,
      } = props;

      await createEventPassNftContract(object);

      const hasuraMetadatas = await this.createHasuraMetadatas(
        metadatas,
        results,
        baseUri,
        chainId,
        organizerId,
        eventId,
        eventPassId,
        txResult,
      );

      await createEventPassNfts(hasuraMetadatas);
      await createEventParametersAndWebhook({
        eventId,
        nftCollectionAddresses: [{ contractAddress: txResult }],
        organizerId,
        eventSlug,
      });
    } catch (error) {
      throw new Error(`Error saving the event pass data into db : ${error}`);
    }
  }

  private async deployAnNftDropCollection(props: CommonProps) {
    try {
      const { contract, metadatas } =
        await this.deployDropContractAndPrepareMetadata(props);
      const results = await contract.erc721.lazyMint(metadatas);

      const fullBaseUri = (await results[0].data()).uri;
      const baseUri = fullBaseUri.slice(0, -1);

      await this.saveEventPassContractIntoDb({
        props,
        txResult: contract.getAddress(),
        baseUri,
        results,
        metadatas,
        object: {
          type: EventPassNftContractType_Enum.Normal,
          eventPassId: props.id,
          organizerId: props.organizerId,
          eventId: props.eventId,
          contractAddress: contract.getAddress(),
          chainId: props.chainId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error deploying a normal collection : ${error.message}`,
        );
      } else throw new Error(error);
    }
  }

  private generatePassword() {
    return crypto.randomBytes(16).toString('hex');
  }

  private validateEventPassDelayedRevealed(
    eventPassDelayedRevealed: EventPassDelayedRevealed,
  ) {
    const requiredFields = ['nftName', 'nftDescription', 'nftImage'];
    for (const field of requiredFields) {
      if (!eventPassDelayedRevealed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  private async deployDelayedRevealCollection(props: CommonProps) {
    try {
      const eventPassDelayedRevealed = props.eventPassDelayedRevealed;
      if (!eventPassDelayedRevealed) {
        throw new Error('Missing eventPassDelayedRevealed');
      }
      this.validateEventPassDelayedRevealed(eventPassDelayedRevealed);
      const { contract, metadatas } =
        await this.deployDropContractAndPrepareMetadata(props);

      const password = this.generatePassword();

      const results = await contract.erc721.revealer.createDelayedRevealBatch(
        {
          name: eventPassDelayedRevealed.nftName,
          description: eventPassDelayedRevealed.nftDescription,
          image: eventPassDelayedRevealed.nftImage.url,
        },
        metadatas,
        password,
      );

      const fullBaseUri = (await contract.erc721.getAll())[0].metadata.uri;
      const baseUri = fullBaseUri.slice(0, -1);

      await this.saveEventPassContractIntoDb({
        props,
        txResult: contract.getAddress(),
        baseUri,
        results,
        metadatas,
        object: {
          type: EventPassNftContractType_Enum.DelayedReveal,
          eventPassId: props.id,
          organizerId: props.organizerId,
          eventId: props.eventId,
          contractAddress: contract.getAddress(),
          chainId: props.chainId,
          password,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error deploying a delayed reveal collection : ${error.message}`,
        );
      } else throw new Error(error);
    }
  }
}

export class PackCollection {
  private sdk: ThirdwebSDK;
  private nftCollection: NftCollection;

  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
    this.nftCollection = new NftCollection(sdk);
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
        _set: { packId: packNftContract.packId },
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

    const txResult = await this.sdk.deployer.deployBuiltInContract(
      ContractType.PACK,
      {
        name: pack.name,
        primary_sale_recipient: address,
        platform_fee_recipient: address,
        voting_token_address: address,
      },
    );

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
        getEventPassNftContractNfts({ eventPassId: eventPass.id }),
      ),
    );

    const allEventPassNfts: EventPassNftContractNfts =
      eventPassNftContracts.flatMap((contract) => {
        if (!contract) {
          throw new Error(
            "One of your eventPassId doesn't have an eventPassNftContract",
          );
        }
        return contract.eventPassNfts;
      });

    const selectedNfts: EventPassNftContractNfts = [];
    const approvalData = eventPassNftContracts.map((contract) => ({
      contractAddress: contract.contractAddress,
      eventPassId: contract.eventPassId,
    }));

    for (const eventPass of pack.eventPassIds) {
      const requiredAmount = eventPass.amount;
      const availableNfts: EventPassNftContractNfts = allEventPassNfts.filter(
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
        await this.nftCollection.getAddressAndChainId();

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
