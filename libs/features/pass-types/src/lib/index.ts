import type {
  GetEventPassNftByTokenReferenceQuery,
  GetPassedEventsWithEventPassNftsQuery,
  GetUpcomingEventsWithEventPassNftsQuery,
} from '@gql/user/types';

import type {
  GetEventPassNftByIdQuery,
  GetEventPassNftByIdMinimalQuery,
} from '@gql/admin/types';

export type EventPassNftById = NonNullable<
  GetEventPassNftByIdQuery['eventPassNft_by_pk']
>;

export type EventPassNftByIdMinimal = NonNullable<
  GetEventPassNftByIdMinimalQuery['eventPassNft_by_pk']
>;

export interface EventPassNftByTokenReference
  extends NonNullable<
    GetEventPassNftByTokenReferenceQuery['eventPassNft'][number]
  > {
  id?: string;
}

export type EventPassNftOnly = Omit<EventPassNftById, 'eventPass'>;

export type BatchTransferInput = {
  formerOwnerAddress: string;
  eventPassNft: EventPassNftOnly;
};

export type EventPassNft = EventPassNftByTokenReference | EventPassNftById;

export type EventPassed = NonNullable<
  GetPassedEventsWithEventPassNftsQuery['eventParameters']
>[number];

export type EventUpcoming = NonNullable<
  GetUpcomingEventsWithEventPassNftsQuery['eventParameters']
>[number];

export type EventWithEventPassNfts = EventPassed | EventUpcoming;
