import { EventPass } from '@features/back-office/events-types';
import {
  EventPassNftContractType_Enum,
  MinterTemporaryWallet_Insert_Input,
} from '@gql/shared/types';
import { ThirdwebOrganizerCommon } from '@nft/thirdweb-organizer-common';
import {
  EventPassNftContractObject,
  EventSmallData,
  NftsMetadata,
} from '@nft/types';
import { ThirdwebSDK, TransactionResultWithId } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
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
export declare class CollectionDeploymentError extends Error {
  constructor(error: Error);
}
export declare class EventPassCollection {
  private sdk;
  thirdwebOrganizerCommon: ThirdwebOrganizerCommon;
  constructor(sdk: ThirdwebSDK);
  getEventPassCommonProps(
    props: EventPass,
    eventData: EventSmallData,
  ): Promise<EventPassCommonProps>;
  deployEventPassCollection(
    eventPass: EventPass,
    eventData: EventSmallData,
    type: EventPassNftContractType_Enum,
  ): Promise<void>;
  createEventPassMetadatas(
    maxAmount: number,
    metadata: NftsMetadata,
    organizerId: string,
    eventId: string,
    eventPassId: string,
  ): NftsMetadata[];
  createEventPassHasuraMetadatas(
    metadatas: NftsMetadata[],
    results: TransactionResultWithId[],
    baseUri: string,
    chainId: string,
    organizerId: string,
    eventId: string,
    eventPassId: string,
    txResult: string,
  ): Promise<
    {
      metadata: NftsMetadata;
      chainId: string;
      tokenId: number;
      tokenUri: string;
      organizerId: string;
      eventId: string;
      eventPassId: string;
      contractAddress: string;
    }[]
  >;
  private validateEventPassDeployInputs;
  deployEventPassDropContractAndPrepareMetadata(
    props: EventPassCommonProps,
  ): Promise<{
    contract: import('@thirdweb-dev/sdk').SmartContract<ethers.BaseContract>;
    metadatas: NftsMetadata[];
    wallet: {
      address: string;
      privateKey: string;
    };
  }>;
  saveEventPassContractIntoDb({
    props,
    txResult,
    baseUri,
    results,
    metadatas,
    object,
    minterTemporaryWallet,
  }: SaveEventPassContractIntoDbProps): Promise<void>;
  private deployAnEventPassNftDropCollection;
  private generatePassword;
  private validateEventPassDelayedRevealed;
  private deployEventPassDelayedRevealCollection;
  revealEventPassDelayedContract(
    contractAddress: string,
  ): Promise<
    import('dist/libs/gql/admin/types/src/generated').GetListCurrentOwnerAddressForContractAddressQuery
  >;
}
export {};
