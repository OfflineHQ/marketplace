// import type { BoundedNumericStepperProps } from '@ui/components';
import type {
  GetEventParametersAndEventPassesQuery,
  GetEventQuery,
} from '@gql/admin/types';
import type { GetPendingOrderForEventPassesQuery } from '@gql/user/types';
export interface EventSlugs {
  eventSlug: string;
  organizerSlug: string;
}

// Define the data structure for an event
export type Event = NonNullable<GetEventQuery['event']>;

export type EventParameters = NonNullable<Event['eventParameters']>;

export type EventDateLocation = Event['eventDateLocations'][0];

export type LocationAddress = EventDateLocation['locationAddress'];

export type EventOrganizer = NonNullable<Event['organizer']>;

export type EventPasses = NonNullable<
  GetEventParametersAndEventPassesQuery['eventPasses']
>;

export type EventPass = EventPasses[0];

export type PendingOrders = NonNullable<
  GetPendingOrderForEventPassesQuery['pendingOrder']
>;

export type PendingOrder = PendingOrders[0];

export type PassOption = EventPass['passOptions'][0];

export enum SaleStatus {
  NotStarted = 'NotStarted',
  Ongoing = 'Ongoing',
  Ended = 'Ended',
}
