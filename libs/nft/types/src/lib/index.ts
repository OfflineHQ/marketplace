import type {
  GetEventPassOrderFromIdQuery,
  GetEventPassOrdersFromStripeCheckoutSessionQuery,
  UpdateEventPassNftFromNftTransferMutation,
} from '@gql/admin/types';
import type {
  EventPassNft as ImportedEventPassNft,
  NftTransfer as ImportedNftTransfer,
} from '@gql/shared/types';

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
    GetEventPassOrderFromIdQuery['eventPassOrder'][0];
