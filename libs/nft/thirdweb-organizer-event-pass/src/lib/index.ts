'use client';

import {
  EventPass,
  EventPassDelayedRevealed,
} from '@features/back-office/events-types';
import {
  EventPassNftContractType_Enum,
  MinterTemporaryWallet_Insert_Input,
} from '@gql/shared/types';
import {
  ThirdwebOrganizerCommon,
  insertMinterTemporaryWallet,
} from '@nft/thirdweb-organizer-common';
import {
  ContractType,
  EventPassNftContractObject,
  EventSmallData,
  NftsMetadata,
} from '@nft/types';
import { ThirdwebSDK, TransactionResultWithId } from '@thirdweb-dev/sdk';
import * as crypto from 'crypto';
import { ethers } from 'ethers';
import {
  createEventParametersAndWebhook,
  createEventPassNftContract,
  createEventPassNfts,
  getEventPassDelayedRevealPassword,
  saveRevealIntoDb,
} from './action';

interface EventPassCommonProps extends EventPass, EventSmallData {
  address: string;
  chainId: string;
}

type SaveEventPassContractIntoDbProps = {
  props: EventPassCommonProps;
  txResult: string;
  baseUri: string;
  results: TransactionResultWithId[];
  metadatas: NftsMetadata[];
  object: EventPassNftContractObject;
  minterTemporaryWallet: MinterTemporaryWallet_Insert_Input;
};

const EVENT_PASS_BASE_URL = 'https://www.offline.live/pass/organizer/';

export class CollectionDeploymentError extends Error {
  constructor(error: Error) {
    super(`Error deploying an event pass: ${error.message}`);
    this.name = 'EventPassCollectionDeploymentError';
  }
}

export class EventPassCollection {
  private sdk: ThirdwebSDK;
  thirdwebOrganizerCommon: ThirdwebOrganizerCommon;

  constructor(sdk: ThirdwebSDK) {
    this.sdk = sdk;
    this.thirdwebOrganizerCommon = new ThirdwebOrganizerCommon(sdk);
  }

  async getEventPassCommonProps(
    props: EventPass,
    eventData: EventSmallData,
  ): Promise<EventPassCommonProps> {
    const [address, chainIdNumber] =
      await this.thirdwebOrganizerCommon.getAddressAndChainId();
    const chainId = chainIdNumber.toString();
    return {
      ...props,
      ...eventData,
      address,
      chainId,
    };
  }

  async deployEventPassCollection(
    eventPass: EventPass,
    eventData: EventSmallData,
    type: EventPassNftContractType_Enum,
  ) {
    try {
      const commonProps = await this.getEventPassCommonProps(
        eventPass,
        eventData,
      );

      this.validateEventPassDeployInputs(commonProps);

      switch (type) {
        case EventPassNftContractType_Enum.Normal:
          await this.deployAnEventPassNftDropCollection(commonProps);
          break;
        case EventPassNftContractType_Enum.DelayedReveal:
          await this.deployEventPassDelayedRevealCollection(commonProps);
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
  createEventPassMetadatas(
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
        external_url: `${EVENT_PASS_BASE_URL}${organizerId}/event/${eventId}/eventPass/${eventPassId}/${i}`,
      };
    });
  }

  async createEventPassHasuraMetadatas(
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

  private validateEventPassDeployInputs(props: EventPassCommonProps) {
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

  async deployEventPassDropContractAndPrepareMetadata(
    props: EventPassCommonProps,
  ) {
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
      const contractAddress = await this.sdk.deployer.deployBuiltInContract(
        ContractType.NFT_DROP,
        {
          name,
          primary_sale_recipient: address,
          platform_fee_recipient: address,
          voting_token_address: address,
        },
      );

      const txResult = contractAddress.toLowerCase();

      const { contract, wallet } =
        await this.thirdwebOrganizerCommon.setErc721ContractWithClaimConditions(
          txResult,
          maxAmount,
        );

      const metadatas = this.createEventPassMetadatas(
        maxAmount,
        metadata,
        organizerId,
        eventId,
        eventPassId,
      );

      return { contract, metadatas, wallet };
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
    minterTemporaryWallet,
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

      await insertMinterTemporaryWallet(minterTemporaryWallet);

      const hasuraMetadatas = await this.createEventPassHasuraMetadatas(
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

  private async deployAnEventPassNftDropCollection(
    props: EventPassCommonProps,
  ) {
    try {
      const { contract, metadatas, wallet } =
        await this.deployEventPassDropContractAndPrepareMetadata(props);
      const results = await contract.erc721.lazyMint(metadatas);

      const fullBaseUri = (await results[0].data()).uri;
      const baseUri = fullBaseUri.slice(0, -1);

      const contractAddress = contract.getAddress().toLowerCase();

      await this.saveEventPassContractIntoDb({
        props,
        txResult: contractAddress,
        baseUri,
        results,
        metadatas,
        object: {
          type: EventPassNftContractType_Enum.Normal,
          eventPassId: props.id,
          organizerId: props.organizerId,
          eventId: props.eventId,
          contractAddress,
          chainId: props.chainId,
        },
        minterTemporaryWallet: {
          address: wallet.address,
          privateKey: wallet.privateKey,
          eventPassId: props.id,
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

  private async deployEventPassDelayedRevealCollection(
    props: EventPassCommonProps,
  ) {
    try {
      const eventPassDelayedRevealed = props.eventPassDelayedRevealed;
      if (!eventPassDelayedRevealed) {
        throw new Error('Missing eventPassDelayedRevealed');
      }
      this.validateEventPassDelayedRevealed(eventPassDelayedRevealed);
      const { contract, metadatas, wallet } =
        await this.deployEventPassDropContractAndPrepareMetadata(props);

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

      const contractAddress = contract.getAddress().toLowerCase();

      await this.saveEventPassContractIntoDb({
        props,
        txResult: contractAddress,
        baseUri,
        results,
        metadatas,
        object: {
          type: EventPassNftContractType_Enum.DelayedReveal,
          eventPassId: props.id,
          organizerId: props.organizerId,
          eventId: props.eventId,
          contractAddress,
          chainId: props.chainId,
          password,
        },
        minterTemporaryWallet: {
          address: wallet.address,
          privateKey: wallet.privateKey,
          eventPassId: props.id,
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

  async revealEventPassDelayedContract(contractAddress: string) {
    if (!this.sdk) {
      throw new Error('SDK is undefined');
    }

    try {
      const eventPassNftContract =
        await getEventPassDelayedRevealPassword(contractAddress);

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

      return saveRevealIntoDb(contractAddress);
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
}
