import type { GetEventWithPassesQuery } from '@gql/anonymous/types';
import type { GetEventPassPendingOrdersQuery } from '@gql/user/types';

export type EventCart = NonNullable<GetEventWithPassesQuery['event']>;

export type UserPassPendingOrder =
  GetEventPassPendingOrdersQuery['eventPassPendingOrder'][0];
