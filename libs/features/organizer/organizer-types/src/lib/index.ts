import {
  GetOrganizerLatestEventsQuery,
  GetOrganizerQuery,
} from '@gql/admin/types';

export type Organizer = NonNullable<GetOrganizerQuery['organizer']>;

export type OrganizerLatestEvents = NonNullable<
  GetOrganizerLatestEventsQuery['eventParameters']
>;
