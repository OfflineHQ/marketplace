'use client';

import env from '@env/client';
import {
  EventPass,
  EventPassDelayedRevealed,
} from '@features/back-office/events-types';
import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import {
  EventPassNftContractType_Enum,
  EventPassNftContract_Insert_Input,
} from '@gql/shared/types';
import {
  NFTMetadata as ThirdwebNFTMetadata,
  ThirdwebSDK,
  TransactionResultWithId,
} from '@thirdweb-dev/sdk';
import * as crypto from 'crypto';
import { Signer, ethers } from 'ethers';
import {
  createEventParametersAndWebhook,
  createEventPassNftContract,
  createEventPassNfts,
} from './action';

type NftsMetadata = ThirdwebNFTMetadata & {
  name: string;
};

type EventSmallData = Omit<GetEventPassOrganizerFolderPath, 'eventPassId'> & {
  eventSlug: string;
};

type EventPassNftContractObject = Required<
  Pick<
    EventPassNftContract_Insert_Input,
    | 'type'
    | 'contractAddress'
    | 'eventPassId'
    | 'chainId'
    | 'eventId'
    | 'organizerId'
  >
> &
  EventPassNftContract_Insert_Input;

interface CommonProps extends EventPass, EventSmallData {
  address: string;
  chainId: string;
}

type SaveEventPassContractIntoDbProps = {
  props: CommonProps;
  txResult: string;
  baseUri: string;
  results: TransactionResultWithId[];
  metadatas: NftsMetadata[];
  object: EventPassNftContractObject;
};

const CONTRACT_TYPE_NFT_DROP = 'nft-drop';
const CONTRACT_TYPE_PACK = 'pack';
const BASE_URL = 'https://www.offline.live/pass/organizer/';

enum ContractType {
  NFT_DROP = CONTRACT_TYPE_NFT_DROP,
  PACK = CONTRACT_TYPE_PACK,
}

class CollectionDeploymentError extends Error {
  constructor(error: Error) {
    super(`Error deploying a collection: ${error.message}`);
    this.name = 'CollectionDeploymentError';
  }
}

class NftCollection {
  private sdk: ThirdwebSDK;

  constructor(signer: Signer) {
    this.sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN, {
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      gasless: {
        openzeppelin: {
          relayerUrl: env.NEXT_PUBLIC_OPENZEPPELIN_URL,
        },
      },
    });
  }

  async getCommonProps(
    props: EventPass,
    eventData: EventSmallData,
  ): Promise<CommonProps> {
    const [address, chainIdNumber] = await Promise.all([
      this.sdk.wallet.getAddress(),
      this.sdk.wallet.getChainId(),
    ]);
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
      'eventPassPricing',
    ];

    for (const field of requiredFields) {
      if (!props[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!props.eventPassPricing.maxAmount) {
      throw new Error('Missing required field: eventPassPricing.maxAmount');
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
      eventPassPricing: { maxAmount },
    } = props;

    const metadata: NftsMetadata = {
      name: nftName,
      description: nftDescription,
      image: nftImage.url,
    };

    try {
      const txResult = await this.sdk.deployer.deployBuiltInContract(
        ContractType.NFT_DROP,
        {
          name,
          primary_sale_recipient: address,
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
        throw new CollectionDeploymentError(error);
      }
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
    const { id: eventPassId, chainId, eventId, organizerId, eventSlug } = props;

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
  }

  private async deployAnNftDropCollection(props: CommonProps) {
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

      const baseUri = (await contract.erc721.getAll())[0].metadata.uri;

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
      throw new CollectionDeploymentError(error);
    }
  }
}

export default NftCollection;
