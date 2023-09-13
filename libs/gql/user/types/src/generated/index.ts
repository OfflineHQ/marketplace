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

export type GetEventWithPassesQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null }> } | null };

export type InsertEventPassPendingOrdersMutationVariables = Types.Exact<{
  objects: Array<Types.EventPassPendingOrder_Insert_Input> | Types.EventPassPendingOrder_Insert_Input;
}>;


export type InsertEventPassPendingOrdersMutation = { __typename?: 'mutation_root', insert_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', returning: Array<{ __typename?: 'eventPassPendingOrder', id: any, quantity: number, eventPassId: string, created_at: any }> } | null };

export type DeleteEventPassPendingOrderMutationVariables = Types.Exact<{
  eventPassPendingOrderId: Types.Scalars['uuid'];
}>;


export type DeleteEventPassPendingOrderMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder_by_pk?: { __typename?: 'eventPassPendingOrder', id: any } | null };

export type DeleteEventPassPendingOrdersMutationVariables = Types.Exact<{
  eventPassIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type DeleteEventPassPendingOrdersMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null };

export type GetEventPassPendingOrderForEventPassesQueryVariables = Types.Exact<{
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetEventPassPendingOrderForEventPassesQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any }> };

export type GetEventPassPendingOrdersQueryVariables = Types.Exact<{
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassPendingOrdersQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null };

export type GetPassedEventsWithEventPassNftsQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetPassedEventsWithEventPassNftsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, timezone?: string | null, eventPassNftContracts: Array<{ __typename?: 'eventPassNftContract', eventPass?: { __typename?: 'EventPass', id: string, name: string, nftImage: { __typename?: 'Asset', url: string } } | null, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, tokenId: any }> }>, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetUpcomingEventsWithEventPassNftsQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetUpcomingEventsWithEventPassNftsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, timezone?: string | null, eventPassNftContracts: Array<{ __typename?: 'eventPassNftContract', eventPass?: { __typename?: 'EventPass', id: string, name: string, nftImage: { __typename?: 'Asset', url: string } } | null, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, tokenId: any }> }>, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetEventPassNftByTokenReferenceQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String'];
  eventId: Types.Scalars['String'];
  eventPassId: Types.Scalars['String'];
  tokenId: Types.Scalars['bigint'];
  chainId: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByTokenReferenceQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null } | null } | null }> };
