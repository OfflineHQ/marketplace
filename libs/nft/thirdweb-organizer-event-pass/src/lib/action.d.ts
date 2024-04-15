import { GetEventPassNftContractNftsLazyMintedQueryVariables } from '@gql/admin/types';
import type {
  EventPassNftContract_Insert_Input,
  EventPassNft_Insert_Input,
} from '@gql/shared/types';
export declare function createEventPassNftContract(
  object: EventPassNftContract_Insert_Input,
): Promise<
  | {
      __typename?: 'eventPassNftContract' | undefined;
      chainId: string;
      contractAddress: string;
      eventId: string;
      eventPassId: string;
      organizerId: string;
    }
  | null
  | undefined
>;
export declare function createEventPassNfts(
  objects: EventPassNft_Insert_Input[],
): Promise<{
  __typename?: 'eventPassNft_mutation_response' | undefined;
  affected_rows: number;
  returning: {
    __typename?: 'eventPassNft' | undefined;
    contractAddress: string;
    tokenId?: any;
    metadata?: any;
    error?: string | null | undefined;
    tokenUri?: string | null | undefined;
    chainId: string;
    eventId: string;
    eventPassId: string;
    organizerId: string;
    currentOwnerAddress?: string | null | undefined;
    lastNftTransferId?: any;
    isRevealed: boolean;
    id: any;
    created_at: any;
    updated_at: any;
  }[];
} | null>;
export declare function getEventPassNftContractNftsLazyMinted(
  id: GetEventPassNftContractNftsLazyMintedQueryVariables,
): Promise<{
  __typename?: 'eventPassNftContract' | undefined;
  contractAddress: string;
  eventPassId: string;
  eventPassNfts: {
    __typename?: 'eventPassNft' | undefined;
    id: any;
    packId?: string | null | undefined;
    currentOwnerAddress?: string | null | undefined;
    contractAddress: string;
    eventId: string;
    tokenId?: any;
    eventPassId: string;
    status?: import('@gql/shared/types').NftStatus_Enum | null | undefined;
  }[];
}>;
interface CreateEventParametersAndWebhookProps {
  eventId: string;
  nftCollectionAddresses: string[];
  organizerId: string;
  eventSlug: string;
}
export declare function createEventParametersAndWebhook({
  eventId,
  nftCollectionAddresses,
  organizerId,
  eventSlug,
}: CreateEventParametersAndWebhookProps): Promise<void>;
export declare function getEventPassDelayedRevealPassword(
  contractAddress: string,
): Promise<{
  __typename?: 'eventPassNftContract' | undefined;
  type: import('@gql/shared/types').EventPassNftContractType_Enum;
  isDelayedRevealed: boolean;
  password?: string | null | undefined;
}>;
export declare function saveRevealIntoDb(
  contractAddress: string,
): Promise<
  import('@gql/admin/types').GetListCurrentOwnerAddressForContractAddressQuery
>;
export {};
