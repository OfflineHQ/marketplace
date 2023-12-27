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


export type GetEventWithPassesQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, passAmount?: { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number } | null }> } | null };

export type GetOrdersConfirmedQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetOrdersConfirmedQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, quantity: number }> };

export type GetOrdersIsMintingQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetOrdersIsMintingQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, quantity: number }> };

export type GetOrdersFromIdsQueryVariables = Types.Exact<{
  orderIds: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
  stage: Types.Stage;
}>;


export type GetOrdersFromIdsQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, quantity: number, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> };

export type GetOrderPurchasedForEventPassesIdQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String'];
}>;


export type GetOrderPurchasedForEventPassesIdQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, quantity: number }> };

export type GetOrderPurchasedForEventPassesIdsQueryVariables = Types.Exact<{
  eventPassIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type GetOrderPurchasedForEventPassesIdsQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, quantity: number }> };

export type UpsertEventPassPendingOrderMutationVariables = Types.Exact<{
  object: Types.PendingOrder_Insert_Input;
}>;


export type UpsertEventPassPendingOrderMutation = { __typename?: 'mutation_root', insert_pendingOrder_one?: { __typename?: 'pendingOrder', id: any, quantity: number, eventPassId?: string | null, created_at: any } | null };

export type UpsertEventPassPendingOrdersMutationVariables = Types.Exact<{
  objects: Array<Types.PendingOrder_Insert_Input> | Types.PendingOrder_Insert_Input;
  stage: Types.Stage;
}>;


export type UpsertEventPassPendingOrdersMutation = { __typename?: 'mutation_root', insert_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', returning: Array<{ __typename?: 'pendingOrder', id: any, eventPassId?: string | null, quantity: number, created_at: any, passAmount?: { __typename?: 'passAmount', timeBeforeDelete: number } | null, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> } | null };

export type UpsertPackPendingOrderMutationVariables = Types.Exact<{
  object: Types.PendingOrder_Insert_Input;
}>;


export type UpsertPackPendingOrderMutation = { __typename?: 'mutation_root', insert_pendingOrder_one?: { __typename?: 'pendingOrder', id: any, quantity: number, packId?: string | null, created_at: any } | null };

export type UpsertPackPendingOrdersMutationVariables = Types.Exact<{
  objects: Array<Types.PendingOrder_Insert_Input> | Types.PendingOrder_Insert_Input;
  stage: Types.Stage;
}>;


export type UpsertPackPendingOrdersMutation = { __typename?: 'mutation_root', insert_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', returning: Array<{ __typename?: 'pendingOrder', id: any, packId?: string | null, quantity: number, created_at: any, packAmount?: { __typename?: 'passAmount', timeBeforeDelete: number } | null, pack?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> } | null };

export type DeletePendingOrderMutationVariables = Types.Exact<{
  pendingOrderId: Types.Scalars['uuid'];
}>;


export type DeletePendingOrderMutation = { __typename?: 'mutation_root', delete_pendingOrder_by_pk?: { __typename?: 'pendingOrder', id: any } | null };

export type DeletePendingOrdersMutationVariables = Types.Exact<{
  eventPassIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type DeletePendingOrdersMutation = { __typename?: 'mutation_root', delete_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', affected_rows: number } | null };

export type DeleteAllPendingOrdersMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type DeleteAllPendingOrdersMutation = { __typename?: 'mutation_root', delete_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', affected_rows: number } | null };

export type GetPendingOrderForEventPassQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String'];
}>;


export type GetPendingOrderForEventPassQuery = { __typename?: 'query_root', pendingOrder: Array<{ __typename?: 'pendingOrder', id: any, eventPassId?: string | null, quantity: number, created_at: any }> };

export type GetPendingOrderForEventPassesQueryVariables = Types.Exact<{
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetPendingOrderForEventPassesQuery = { __typename?: 'query_root', pendingOrder: Array<{ __typename?: 'pendingOrder', id: any, eventPassId?: string | null, quantity: number, created_at: any }> };

export type GetPendingOrdersQueryVariables = Types.Exact<{
  stage: Types.Stage;
}>;


export type GetPendingOrdersQuery = { __typename?: 'query_root', pendingOrder: Array<{ __typename?: 'pendingOrder', id: any, eventPassId?: string | null, packId?: string | null, quantity: number, created_at: any, passAmount?: { __typename?: 'passAmount', timeBeforeDelete: number } | null, packAmount?: { __typename?: 'passAmount', timeBeforeDelete: number } | null, eventPass?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null, pack?: { __typename?: 'EventPass', event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> };

export type GetPendingOrdersMinimalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetPendingOrdersMinimalQuery = { __typename?: 'query_root', pendingOrder: Array<{ __typename?: 'pendingOrder', eventPassId?: string | null, packId?: string | null, quantity: number }> };

export type GetKycQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetKycQuery = { __typename?: 'query_root', kyc: Array<{ __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null }> };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type OrganizerFieldsFragment = { __typename?: 'Organizer', imageClasses?: string | null, name: string, slug: string, image: { __typename?: 'Asset', url: string } };

export type PassAmountFieldsFragment = { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number };

export type PassPricingFieldsFragment = { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum };

export type InsertFollowOrganizerMutationVariables = Types.Exact<{
  organizerSlug: Types.Scalars['String'];
}>;


export type InsertFollowOrganizerMutation = { __typename?: 'mutation_root', insert_follow_one?: { __typename?: 'follow', organizerSlug: string } | null };

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null };

export type GetPassedEventsWithEventPassNftsQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetPassedEventsWithEventPassNftsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, timezone?: string | null, eventPassNftContracts: Array<{ __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, isDelayedRevealed: boolean, eventPass?: { __typename?: 'EventPass', id: string, name: string, event?: { __typename?: 'Event', slug: string } | null, nftImage: { __typename?: 'Asset', url: string } } | null, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, tokenId: any }> }>, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetUpcomingEventsWithEventPassNftsQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
  currentDate: Types.Scalars['timestamp'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetUpcomingEventsWithEventPassNftsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, timezone?: string | null, eventPassNftContracts: Array<{ __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, isDelayedRevealed: boolean, eventPass?: { __typename?: 'EventPass', id: string, name: string, event?: { __typename?: 'Event', slug: string } | null, nftImage: { __typename?: 'Asset', url: string } } | null, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, tokenId: any }> }>, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetEventPassNftByTokenReferenceQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String'];
  eventId: Types.Scalars['String'];
  eventPassId: Types.Scalars['String'];
  tokenId: Types.Scalars['bigint'];
  chainId: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByTokenReferenceQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null } | null }> };

export type RoleAssignmentFieldsFragment = { __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string };

export type GetMyRolesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetMyRolesQuery = { __typename?: 'query_root', roleAssignment: Array<{ __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string }> };

export type GetMyRolesWithOrganizerInfosQueryVariables = Types.Exact<{
  stage: Types.Stage;
}>;


export type GetMyRolesWithOrganizerInfosQuery = { __typename?: 'query_root', roleAssignment: Array<{ __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string, organizer?: { __typename?: 'Organizer', imageClasses?: string | null, name: string, slug: string, image: { __typename?: 'Asset', url: string } } | null }> };

export type GetMyRolesWithOrganizerAndInviterInfosQueryVariables = Types.Exact<{
  stage: Types.Stage;
}>;


export type GetMyRolesWithOrganizerAndInviterInfosQuery = { __typename?: 'query_root', roleAssignment: Array<{ __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string, organizer?: { __typename?: 'Organizer', imageClasses?: string | null, name: string, slug: string, image: { __typename?: 'Asset', url: string } } | null, inviter: { __typename?: 'account', address: string, email?: string | null } }> };

export type GetStripeCustomerQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetStripeCustomerQuery = { __typename?: 'query_root', stripeCustomer: Array<{ __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any }> };
