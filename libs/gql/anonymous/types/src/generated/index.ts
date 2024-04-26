import * as Types from '@gql/shared/types';

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type PassAmountFieldsFragment = { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null };

export type PassPricingFieldsFragment = { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum };

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', tokenId?: any | null, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null };

export type GetEventPassNftByTokenReferenceQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String']['input'];
  eventId: Types.Scalars['String']['input'];
  eventPassId: Types.Scalars['String']['input'];
  tokenId: Types.Scalars['bigint']['input'];
  chainId: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByTokenReferenceQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId?: any | null, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null } | null }> };

export type GetShopifyCustomerQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String']['input'];
  customerId: Types.Scalars['String']['input'];
}>;


export type GetShopifyCustomerQuery = { __typename?: 'query_root', shopifyCustomer: Array<{ __typename?: 'shopifyCustomer', address: string }> };
