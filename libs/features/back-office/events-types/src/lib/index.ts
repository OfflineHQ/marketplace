import type { GetEventsFromOrganizerIdQuery } from '@gql/admin/types';

export type EventFromOrganizer = NonNullable<
  NonNullable<GetEventsFromOrganizerIdQuery['organizer']>['events']
>[0];
