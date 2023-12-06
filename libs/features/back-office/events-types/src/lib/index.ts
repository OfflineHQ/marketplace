import type {
  GetEventPassDelayedRevealedFromEventPassIdQuery,
  GetEventWithPassesOrganizerQuery,
  GetEventsFromOrganizerIdTableQuery,
} from '@gql/admin/types';

export type EventFromOrganizerWithPasses = NonNullable<
  GetEventWithPassesOrganizerQuery['event']
>;

export type EventFromOrganizerTable = NonNullable<
  NonNullable<GetEventsFromOrganizerIdTableQuery['organizer']>['events']
>[0];

export type EventPassDelayedRevealed = NonNullable<
  GetEventPassDelayedRevealedFromEventPassIdQuery['eventPass']
>['eventPassDelayedRevealed'];
