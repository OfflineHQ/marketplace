import { PendingOrder } from '@features/organizer/event-types';
import type { GetEventWithPassesQuery } from '@gql/admin/types';
import type {
  GetEventPassOrdersFromIdsQuery,
  GetEventPassPendingOrdersQuery,
} from '@gql/user/types';

export type EventCart = NonNullable<GetEventWithPassesQuery['event']>;

export type UserPassPendingOrder =
  GetEventPassPendingOrdersQuery['eventPassPendingOrder'][0];

export interface EventPassCart
  extends Pick<PendingOrder, 'eventPassId' | 'quantity'> {
  created_at?: string;
}

export type UserPassOrder = GetEventPassOrdersFromIdsQuery['eventPassOrder'][0];

export type AllPassesCart = Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes
