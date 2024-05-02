import type { GetLoyaltyCardOrganizerQuery } from '@gql/admin/types';

export type LoyaltyCardOrganizer = NonNullable<
  NonNullable<GetLoyaltyCardOrganizerQuery['organizer']>['loyaltyCard']
>;
