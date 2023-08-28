import type { GetEventPassNftByIdQuery } from '@gql/user/types';

export type EventPassNftById = NonNullable<
  GetEventPassNftByIdQuery['eventPassNft_by_pk']
>;

export type EventPassNftOnly = Omit<EventPassNftById, 'eventPass'>;

export type BatchTransferInput = {
  formerOwnerAddress: string;
  eventPassNft: EventPassNftOnly;
};

export type EventPassNft = EventPassNftOnly & {
  eventPass: NonNullable<EventPassNftById['eventPass']>;
};
