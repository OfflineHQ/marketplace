import { PendingOrder } from '@features/organizer/event-types';
import type { GetEventWithPassesQuery } from '@gql/admin/types';
import type {
  GetOrdersFromIdsQuery,
  GetPendingOrdersQuery,
} from '@gql/user/types';

export type EventCart = NonNullable<GetEventWithPassesQuery['event']>;

export type UserPassPendingOrder = GetPendingOrdersQuery['pendingOrder'][0];

export interface EventPassCart
  extends Pick<PendingOrder, 'eventPassId' | 'quantity'> {
  created_at?: string;
}

export type UserPassOrder = GetOrdersFromIdsQuery['eventPassOrder'][0];

export type AllPassesCart = Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes
