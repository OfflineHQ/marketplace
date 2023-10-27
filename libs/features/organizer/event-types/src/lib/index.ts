// import type { BoundedNumericStepperProps } from '@ui/components';
import type { GetEventPassesQuery, GetEventQuery } from '@gql/admin/types';
import type { GetEventPassPendingOrderForEventPassesQuery } from '@gql/user/types';
export interface EventSlugs {
  eventSlug: string;
  organizerSlug: string;
}

// Define the data structure for an event
export type Event = NonNullable<GetEventQuery['event']>;

export type EventDateLocation = Event['eventDateLocations'][0];

export type LocationAddress = EventDateLocation['locationAddress'];

export type EventOrganizer = NonNullable<Event['organizer']>;

export type EventPasses = NonNullable<GetEventPassesQuery['eventPasses']>;

export type EventPass = EventPasses[0];

export type EventPassPendingOrders = NonNullable<
  GetEventPassPendingOrderForEventPassesQuery['eventPassPendingOrder']
>;

export type EventPassPendingOrder = EventPassPendingOrders[0];

export type PassOption = EventPass['passOptions'][0];
