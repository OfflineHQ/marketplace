import type { GetEventPassNftByTokenReferenceQuery } from '@gql/user/types';

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
