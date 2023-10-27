import { EventPassPendingOrder } from '@features/organizer/event-types';
import type { GetEventWithPassesQuery } from '@gql/anonymous/types';
import type {
  GetEventPassOrdersFromIdsQuery,
  GetEventPassPendingOrdersQuery,
} from '@gql/user/types';

export type EventCart = NonNullable<GetEventWithPassesQuery['event']>;

export type UserPassPendingOrder =
  GetEventPassPendingOrdersQuery['eventPassPendingOrder'][0];

export type EventPassCart = Pick<
  EventPassPendingOrder,
  'eventPassId' | 'quantity'
>;

export type UserPassOrder = GetEventPassOrdersFromIdsQuery['eventPassOrder'][0];

export type AllPassesCart = Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes
