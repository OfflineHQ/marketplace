// import type { BoundedNumericStepperProps } from '@ui/components';
import type {
  GetEventQuery,
  GetEventPassesQuery,
  GetEventsFromOrganizerIdQuery,
} from '@gql/admin/types';
// import type {
//   Coordinates as TCoordinates,
//   EventDateLocation as TEventDateLocation,
//   LocationAddress as TLocationAddress,
//   Organizer as TOrganizer,
//   Currency as TCurrency,
//   Locale as TLocale,
// } from '@gql/shared/types';

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

export interface EventPassCart extends Pick<EventPass, 'id'> {
  amount: number;
}

export type AllPassesCart = Record<string, Record<string, EventPassCart[]>>; // EventPasses will be grouped by organizerSlug -> eventSlug -> passes

export type PassOption = EventPass['passOptions'][0];

export type EventFromOrganizer = NonNullable<
  NonNullable<GetEventsFromOrganizerIdQuery['organizer']>['events']
>[0];
