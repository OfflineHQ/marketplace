import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import type {
  GetEventPassOrderFromIdQuery,
  GetEventPassOrdersFromStripeCheckoutSessionQuery,
  UpdateEventPassNftFromNftTransferMutation,
} from '@gql/admin/types';
import type {
  EventPassNft as ImportedEventPassNft,
  NftTransfer as ImportedNftTransfer,
} from '@gql/shared/types';
import { EventPassNftContract_Insert_Input } from '@gql/shared/types';
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

export type EventPassOrderWithContractData =
  GetEventPassOrdersFromStripeCheckoutSessionQuery['eventPassOrder'][0] &
    GetEventPassOrderFromIdQuery['eventPassOrder_by_pk'];

export enum ContractType {
  NFT_DROP = 'nft-drop',
  PACK = 'pack',
}

export type EventSmallData = Omit<
  GetEventPassOrganizerFolderPath,
  'eventPassId'
> & {
  eventSlug: string;
};

export type NftsMetadata = ThirdwebNFTMetadata & {
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

export type RequiredEventPassNft = Required<
  Pick<EventPassNft, 'contractAddress' | 'tokenId'>
>;
