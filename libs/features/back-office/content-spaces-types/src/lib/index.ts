import { FileSummary } from '@bytescale/sdk';
import type {
  GetContentSpacesFromOrganizerIdTableQuery,
  GetContentSpaceWithPassesOrganizerQuery,
} from '@gql/admin/types';

export type ContentSpaceFromOrganizerTable = NonNullable<
  NonNullable<
    GetContentSpacesFromOrganizerIdTableQuery['organizer']
  >['contentSpaces']
>[number];

export type ContentSpaceFromOrganizerWithPasses = NonNullable<
  GetContentSpaceWithPassesOrganizerQuery['contentSpace']
>;

export type EventPass = ContentSpaceFromOrganizerWithPasses['eventPasses'][0];

export interface ContentSpaceFileWithName extends FileSummary {
  fileName: string;
}
