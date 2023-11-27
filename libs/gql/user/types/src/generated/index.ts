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

export type GetEventPassOrdersConfirmedQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetEventPassOrdersConfirmedQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number }> };

export type GetEventPassOrdersIsMintingQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetEventPassOrdersIsMintingQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number }> };

export type GetEventPassOrdersFromIdsQueryVariables = Types.Exact<{
  eventPassOrderIds: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
  stage: Types.Stage;
}>;


export type GetEventPassOrdersFromIdsQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> };

export type GetEventPassOrderPurchasedForEventPassesIdQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String'];
}>;


export type GetEventPassOrderPurchasedForEventPassesIdQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number }> };

export type GetEventPassOrderPurchasedForEventPassesIdsQueryVariables = Types.Exact<{
  eventPassIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type GetEventPassOrderPurchasedForEventPassesIdsQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number }> };

export type UpsertEventPassPendingOrderMutationVariables = Types.Exact<{
  object: Types.EventPassPendingOrder_Insert_Input;
}>;


export type UpsertEventPassPendingOrderMutation = { __typename?: 'mutation_root', insert_eventPassPendingOrder_one?: { __typename?: 'eventPassPendingOrder', id: any, quantity: number, eventPassId: string, created_at: any } | null };

export type UpsertEventPassPendingOrdersMutationVariables = Types.Exact<{
  objects: Array<Types.EventPassPendingOrder_Insert_Input> | Types.EventPassPendingOrder_Insert_Input;
  stage: Types.Stage;
}>;


export type UpsertEventPassPendingOrdersMutation = { __typename?: 'mutation_root', insert_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', returning: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any, eventPassPricing?: { __typename?: 'eventPassPricing', timeBeforeDelete: number } | null, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> } | null };

export type DeleteEventPassPendingOrderMutationVariables = Types.Exact<{
  eventPassPendingOrderId: Types.Scalars['uuid'];
}>;


export type DeleteEventPassPendingOrderMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder_by_pk?: { __typename?: 'eventPassPendingOrder', id: any } | null };

export type DeleteEventPassPendingOrdersMutationVariables = Types.Exact<{
  eventPassIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type DeleteEventPassPendingOrdersMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null };

export type DeleteAllEventPassPendingOrdersMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type DeleteAllEventPassPendingOrdersMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null };

export type GetEventPassPendingOrderForEventPassQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String'];
}>;


export type GetEventPassPendingOrderForEventPassQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any }> };

export type GetEventPassPendingOrderForEventPassesQueryVariables = Types.Exact<{
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetEventPassPendingOrderForEventPassesQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any }> };

export type GetEventPassPendingOrdersQueryVariables = Types.Exact<{
  stage: Types.Stage;
}>;


export type GetEventPassPendingOrdersQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any, eventPassPricing?: { __typename?: 'eventPassPricing', timeBeforeDelete: number } | null, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> };

export type GetEventPassPendingOrdersMinimalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetEventPassPendingOrdersMinimalQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', eventPassId: string, quantity: number }> };

export type GetKycQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetKycQuery = { __typename?: 'query_root', kyc: Array<{ __typename?: 'kyc', applicantId: string, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null }> };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type OrganizerFieldsFragment = { __typename?: 'Organizer', name: string, slug: string, image: { __typename?: 'Asset', url: string } };

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null };

export type GetPassedEventsWithEventPassNftsQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetPassedEventsWithEventPassNftsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, timezone?: string | null, eventPassNftContracts: Array<{ __typename?: 'eventPassNftContract', eventPass?: { __typename?: 'EventPass', id: string, name: string, event?: { __typename?: 'Event', slug: string } | null, nftImage: { __typename?: 'Asset', url: string } } | null, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, tokenId: any }> }>, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetUpcomingEventsWithEventPassNftsQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetUpcomingEventsWithEventPassNftsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, timezone?: string | null, eventPassNftContracts: Array<{ __typename?: 'eventPassNftContract', eventPass?: { __typename?: 'EventPass', id: string, name: string, event?: { __typename?: 'Event', slug: string } | null, nftImage: { __typename?: 'Asset', url: string } } | null, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, tokenId: any }> }>, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetEventPassNftByTokenReferenceQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String'];
  eventId: Types.Scalars['String'];
  eventPassId: Types.Scalars['String'];
  tokenId: Types.Scalars['bigint'];
  chainId: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByTokenReferenceQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null } | null } | null }> };

export type RoleAssignmentsFieldsFragment = { __typename?: 'roleAssignments', role: Types.Roles_Enum, organizerId: string, eventId: string };

export type GetMyRolesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetMyRolesQuery = { __typename?: 'query_root', roleAssignments: Array<{ __typename?: 'roleAssignments', role: Types.Roles_Enum, organizerId: string, eventId: string }> };

export type GetMyRolesWithOrganizerInfosQueryVariables = Types.Exact<{
  stage: Types.Stage;
}>;


export type GetMyRolesWithOrganizerInfosQuery = { __typename?: 'query_root', roleAssignments: Array<{ __typename?: 'roleAssignments', role: Types.Roles_Enum, organizerId: string, eventId: string, organizer?: { __typename?: 'Organizer', name: string, slug: string, image: { __typename?: 'Asset', url: string } } | null }> };

export type GetMyRolesWithOrganizerAndInviterInfosQueryVariables = Types.Exact<{
  stage: Types.Stage;
}>;


export type GetMyRolesWithOrganizerAndInviterInfosQuery = { __typename?: 'query_root', roleAssignments: Array<{ __typename?: 'roleAssignments', role: Types.Roles_Enum, organizerId: string, eventId: string, organizer?: { __typename?: 'Organizer', name: string, slug: string, image: { __typename?: 'Asset', url: string } } | null, inviter: { __typename?: 'account', address: string, email?: string | null } }> };

export type GetStripeCustomerQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetStripeCustomerQuery = { __typename?: 'query_root', stripeCustomer: Array<{ __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any }> };
