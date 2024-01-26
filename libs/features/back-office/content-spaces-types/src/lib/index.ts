import type { GetContentSpacesFromOrganizerIdTableQuery } from '@gql/admin/types';

export type ContentSpaceFromOrganizerTable = NonNullable<
  NonNullable<
    GetContentSpacesFromOrganizerIdTableQuery['organizer']
  >['contentSpaces']
>[number];
