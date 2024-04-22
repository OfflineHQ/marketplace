import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import type {
  GetEventPassNftContractNftsLazyMintedQuery,
  GetNftMintPasswordsForContractAvailableQuery,
  GetNftMintPasswordsForContractQuery,
  GetOrderFromIdQuery,
  GetOrdersFromStripeCheckoutSessionQuery,
  UpdateEventPassNftFromNftTransferMutation,
} from '@gql/admin/types';
import type {
  EventPassNft as ImportedEventPassNft,
  NftTransfer as ImportedNftTransfer,
} from '@gql/shared/types';
import {
  EventPassNftContract_Insert_Input,
  NftStatus_Enum,
} from '@gql/shared/types';
import { NFTMetadata as ThirdwebNFTMetadata } from '@thirdweb-dev/sdk';

export type NftTransfer = ImportedNftTransfer;

export type NftTransferNotCreated = Omit<
  ImportedNftTransfer,
  'id' | 'created_at'
>;

export type NftTransferWithoutMetadata = Omit<
  NftTransferNotCreated,
  'eventId' | 'organizerId' | 'eventPassId'
>;

export type EventPassNft = ImportedEventPassNft;

export type EventPassNftAfterMutation = NonNullable<
  NonNullable<
    UpdateEventPassNftFromNftTransferMutation['update_eventPassNft_many']
  >[0]
>['returning'][0];

export type OrderWithContractData =
  GetOrdersFromStripeCheckoutSessionQuery['order'][0] &
    GetOrderFromIdQuery['order_by_pk'];

export enum ContractType {
  NFT_DROP = 'nft-drop',
  PACK = 'pack',
  LOYALTY_CARD = 'loyalty-card',
}

export type EventSmallData = Omit<
  GetEventPassOrganizerFolderPath,
  'eventPassId'
> & {
  eventSlug: string;
};

export type NftsMetadata = Omit<ThirdwebNFTMetadata, 'id' | 'uri'> & {
  name: string;
};

export type EventPassNftContractObject = Required<
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

interface EventPassNftContractNftLazyMinted
  extends NonNullable<
    NonNullable<
      GetEventPassNftContractNftsLazyMintedQuery['eventPassNftContract'][0]['eventPassNfts']
    >[0]
  > {
  status: NftStatus_Enum.LazyMinted;
  tokenId: string;
}

export type EventPassNftContractNftsLazyMinted =
  EventPassNftContractNftLazyMinted[];

export type NftMintPasswordOrganizer = NonNullable<
  GetNftMintPasswordsForContractQuery['nftMintPassword']
>[0];

export type NftMintPassword = NonNullable<
  GetNftMintPasswordsForContractAvailableQuery['nftMintPassword']
>[0];
