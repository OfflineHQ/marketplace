import type {
  GetEventWithPassesOrganizerQuery,
  GetEventsFromOrganizerIdTableQuery,
} from '@gql/admin/types';

export type EventFromOrganizerWithPasses = NonNullable<
  GetEventWithPassesOrganizerQuery['event']
>;

export type EventFromOrganizerTable = NonNullable<
  NonNullable<GetEventsFromOrganizerIdTableQuery['organizer']>['events']
>[0];
