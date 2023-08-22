import type { GetEventPassNftByIdQuery } from '@gql/user/types';

export type EventPassNftById = NonNullable<
  GetEventPassNftByIdQuery['eventPassNft_by_pk']
>;

export type BatchTransferInput = {
  formerOwnerAddress: string;
  eventPassNft: EventPassNftById;
};
