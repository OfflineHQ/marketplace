import * as Types from '@gql/shared/types';

export type AccountFieldsFragment = { __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean };

export type UpdateAccountMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
  account: Types.Account_Set_Input;
}>;


export type UpdateAccountMutation = { __typename?: 'mutation_root', update_account_by_pk?: { __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean } | null };

export type CreateAccountMutationVariables = Types.Exact<{
  account: Types.Account_Insert_Input;
}>;


export type CreateAccountMutation = { __typename?: 'mutation_root', insert_account_one?: { __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean } | null };

export type GetAccountQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
}>;


export type GetAccountQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean }> };

export type GetAccountByEmailQueryVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type GetAccountByEmailQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean }> };

export type GetAccountEventPassOrderForEventPassesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetAccountEventPassOrderForEventPassesQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number, status: Types.OrderStatus_Enum, created_at: any }> };

export type UpsertEventPassOrdersMutationVariables = Types.Exact<{
  objects: Array<Types.EventPassOrder_Insert_Input> | Types.EventPassOrder_Insert_Input;
}>;


export type UpsertEventPassOrdersMutation = { __typename?: 'mutation_root', insert_eventPassOrder?: { __typename?: 'eventPassOrder_mutation_response', returning: Array<{ __typename?: 'eventPassOrder', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId: string, accountId: any, created_at: any }> } | null };

export type GetEventPassPendingOrdersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetEventPassPendingOrdersQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', created_at: any, id: any, eventPassId: string, account?: { __typename?: 'account', email?: string | null, address: string } | null, eventPassPricing?: { __typename?: 'eventPassPricing', timeBeforeDelete: number } | null }> };

export type DeleteEventPassPendingOrdersMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
}>;


export type DeleteEventPassPendingOrdersMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null };

export type EventListFieldsFragment = { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } };

export type OrganizerFieldsFragment = { __typename?: 'Organizer', id: string, slug: string, name: string, description?: { __typename?: 'OrganizerDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> } | null, image: { __typename?: 'Asset', url: string } };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type GetEventQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, description: { __typename?: 'EventDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, eventDateLocations: Array<{ __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } }>, heroImage: { __typename?: 'Asset', url: string } } | null };

export type GetEventWithPassesQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, eventDateLocations: Array<{ __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } }>, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum, maxAmount: number, maxAmountPerUser?: number | null } | null }> } | null };

export type GetEventWithFromOrganizerIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithFromOrganizerIdQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', events: Array<{ __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } }> } | null };

export type GetEventPassesQueryVariables = Types.Exact<{
  eventSlug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassesQuery = { __typename?: 'query_root', eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, eventPassPricing?: { __typename?: 'eventPassPricing', maxAmount: number, maxAmountPerUser?: number | null, priceAmount: number, priceCurrency: Types.Currency_Enum } | null, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } }>, eventPassOrderSums?: { __typename?: 'eventPassOrderSums', totalReserved: number } | null }> };

export type CreateEventPassPricingMutationVariables = Types.Exact<{
  eventPassPricing: Types.EventPassPricing_Insert_Input;
}>;


export type CreateEventPassPricingMutation = { __typename?: 'mutation_root', insert_eventPassPricing_one?: { __typename?: 'eventPassPricing', id: any, eventPassId: string, priceAmount: number, priceCurrency: Types.Currency_Enum, maxAmount: number, maxAmountPerUser?: number | null } | null };

export type UpdateEventPassPricingMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
  eventPassPricing: Types.EventPassPricing_Set_Input;
}>;


export type UpdateEventPassPricingMutation = { __typename?: 'mutation_root', update_eventPassPricing_by_pk?: { __typename?: 'eventPassPricing', id: any, eventPassId: string, priceAmount: number, priceCurrency: Types.Currency_Enum, maxAmount: number, maxAmountPerUser?: number | null } | null };

export type GetOrganizerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetOrganizerQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, description?: { __typename?: 'OrganizerDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> } | null, image: { __typename?: 'Asset', url: string } } | null };

export type EventPassOwnedFieldsFragment = { __typename?: 'eventPassOwned', id: any, eventPassId: string, address: string, isRevealed: boolean, transactionHash: string, timeStamp: any, chainId: string, contractAddress: string, tokenId: any };

export type SetEventPassOwnedRevealedMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type SetEventPassOwnedRevealedMutation = { __typename?: 'mutation_root', update_eventPassOwned_by_pk?: { __typename?: 'eventPassOwned', id: any } | null };
