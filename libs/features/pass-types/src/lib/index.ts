import type {
  GetEventPassOwnedByIdQuery,
  GetEventPassOwnedQuery,
  GetEventPassOwnedWithDetailsQuery,
} from '@gql/user/types';

export type EventPassOwnedById = NonNullable<
  GetEventPassOwnedByIdQuery['eventPassOwned_by_pk']
>;
export type EventPassOwned = NonNullable<
  GetEventPassOwnedQuery['eventPassOwned'][0]
>;
export type EventPassOwnedWithDetails = NonNullable<
  GetEventPassOwnedWithDetailsQuery['eventPassOwned'][0]
>;
