import * as Types from '@gql/shared/types';

export type AccountFieldsFragment = { __typename?: 'account', id: any, email?: string | null };

export type GetAccountQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
}>;


export type GetAccountQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, email?: string | null }> };

export type GetAccountByEmailQueryVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type GetAccountByEmailQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, email?: string | null }> };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type OrganizerFieldsFragment = { __typename?: 'Organizer', imageClasses?: string | null, name: string, slug: string, image: { __typename?: 'Asset', url: string } };

export type PassAmountFieldsFragment = { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number };

export type PassPricingFieldsFragment = { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum };

export type InsertFollowOrganizerMutationVariables = Types.Exact<{
  organizerSlug: Types.Scalars['String'];
}>;


export type InsertFollowOrganizerMutation = { __typename?: 'mutation_root', insert_follow_one?: { __typename?: 'follow', organizerSlug: string } | null };
