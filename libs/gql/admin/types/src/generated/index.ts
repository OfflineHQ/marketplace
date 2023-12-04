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


export type GetAccountQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean, kyc?: { __typename?: 'kyc', applicantId: string, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null, roles: Array<{ __typename?: 'roleAssignments', role: Types.Roles_Enum, organizerId: string, eventId: string }> }> };

export type GetAccountByEmailQueryVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type GetAccountByEmailQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean, kyc?: { __typename?: 'kyc', applicantId: string, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null }> };

export type GetAccountByAddressQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
}>;


export type GetAccountByAddressQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, email?: string | null, emailVerified: boolean }> };

export type GetAccountByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type GetAccountByIdQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', address: string }> };

export type UpdateEventPassOrdersStatusMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassOrder_Updates> | Types.EventPassOrder_Updates;
}>;


export type UpdateEventPassOrdersStatusMutation = { __typename?: 'mutation_root', update_eventPassOrder_many?: Array<{ __typename?: 'eventPassOrder_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassOrder', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId: string, accountId: any, created_at: any }> } | null> | null };

export type SetEventPassOrdersStripeCheckoutSessionIdMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassOrder_Updates> | Types.EventPassOrder_Updates;
}>;


export type SetEventPassOrdersStripeCheckoutSessionIdMutation = { __typename?: 'mutation_root', update_eventPassOrder_many?: Array<{ __typename?: 'eventPassOrder_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassOrder', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId: string, accountId: any, created_at: any, stripeCheckoutSessionId?: string | null }> } | null> | null };

export type MoveEventPassPendingOrdersToConfirmedMutationVariables = Types.Exact<{
  eventPassPendingOrderIds: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
  objects: Array<Types.EventPassOrder_Insert_Input> | Types.EventPassOrder_Insert_Input;
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type MoveEventPassPendingOrdersToConfirmedMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null, insert_eventPassOrder?: { __typename?: 'eventPassOrder_mutation_response', returning: Array<{ __typename?: 'eventPassOrder', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId: string, accountId: any, created_at: any, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, eventPass?: { __typename?: 'EventPass', id: string, name: string, nftImage: { __typename?: 'Asset', url: string }, event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> } | null };

export type GetAccountEventPassOrderForEventPassesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetAccountEventPassOrderForEventPassesQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number, status: Types.OrderStatus_Enum, created_at: any }> };

export type GetEventPassOrderFromIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type GetEventPassOrderFromIdQuery = { __typename?: 'query_root', eventPassOrder_by_pk?: { __typename?: 'eventPassOrder', id: any, eventPassId: string, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number } | null } | null };

export type GetEventPassOrdersFromStripeCheckoutSessionQueryVariables = Types.Exact<{
  stripeCheckoutSessionId: Types.Scalars['String'];
}>;


export type GetEventPassOrdersFromStripeCheckoutSessionQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', id: any, eventPassId: string, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number } | null }> };

export type DeleteEventPassPendingOrdersMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
}>;


export type DeleteEventPassPendingOrdersMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null };

export type GetEventPassPendingOrdersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetEventPassPendingOrdersQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', created_at: any, id: any, eventPassId: string, account?: { __typename?: 'account', email?: string | null, address: string } | null, eventPassPricing?: { __typename?: 'eventPassPricing', timeBeforeDelete: number } | null }> };

export type KycFieldsFragment = { __typename?: 'kyc', applicantId: string, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null };

export type CreateKycMutationVariables = Types.Exact<{
  kyc: Types.Kyc_Insert_Input;
}>;


export type CreateKycMutation = { __typename?: 'mutation_root', insert_kyc_one?: { __typename?: 'kyc', applicantId: string, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null };

export type UpdateKycMutationVariables = Types.Exact<{
  externalUserId: Types.Scalars['uuid'];
  kyc: Types.Kyc_Set_Input;
}>;


export type UpdateKycMutation = { __typename?: 'mutation_root', update_kyc_by_pk?: { __typename?: 'kyc', applicantId: string, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null };

export type DeleteKycMutationVariables = Types.Exact<{
  externalUserId: Types.Scalars['uuid'];
}>;


export type DeleteKycMutation = { __typename?: 'mutation_root', delete_kyc_by_pk?: { __typename?: 'kyc', externalUserId: any } | null };

export type NftTransferFieldsFragment = { __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId: string, organizerId: string, eventPassId: string, tokenId: any, created_at: any };

export type UpsertNftTransferMutationVariables = Types.Exact<{
  objects: Array<Types.NftTransfer_Insert_Input> | Types.NftTransfer_Insert_Input;
}>;


export type UpsertNftTransferMutation = { __typename?: 'mutation_root', insert_nftTransfer?: { __typename?: 'nftTransfer_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId: string, organizerId: string, eventPassId: string, tokenId: any, created_at: any }> } | null };

export type GetNftTransferByTxHashQueryVariables = Types.Exact<{
  txHash: Types.Scalars['String'];
  chainId: Types.Scalars['String'];
}>;


export type GetNftTransferByTxHashQuery = { __typename?: 'query_root', nftTransfer: Array<{ __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId: string, organizerId: string, eventPassId: string, tokenId: any, created_at: any }> };

export type GetNftTransferByTokenIdAndCollectionQueryVariables = Types.Exact<{
  tokenId: Types.Scalars['bigint'];
  contractAddress: Types.Scalars['String'];
  chainId: Types.Scalars['String'];
}>;


export type GetNftTransferByTokenIdAndCollectionQuery = { __typename?: 'query_root', nftTransfer: Array<{ __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId: string, organizerId: string, eventPassId: string, tokenId: any, created_at: any }> };

export type EventListFieldsFragment = { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', width?: number | null, height?: number | null, url: string } };

export type OrganizerFieldsFragment = { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type GetEventQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, description: { __typename?: 'EventDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, eventDateLocations: Array<{ __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } }>, heroImage: { __typename?: 'Asset', width?: number | null, height?: number | null, url: string } } | null };

export type GetEventWithPassesQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, eventDateLocations: Array<{ __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } }>, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum, maxAmount: number, maxAmountPerUser?: number | null } | null }> } | null };

export type GetEventsFromOrganizerIdTableQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventsFromOrganizerIdTableQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', events: Array<{ __typename?: 'Event', title: string, slug: string, eventParameters?: { __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, dateSaleStart?: any | null, dateSaleEnd?: any | null, timezone?: string | null } | null }> } | null };

export type GetEventWithPassesOrganizerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesOrganizerQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', title: string, id: string, slug: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, eventPasses: Array<{ __typename?: 'EventPass', name: string, id: string, description: string, nftName: string, nftDescription: string, nftImage: { __typename?: 'Asset', url: string }, eventPassPricing?: { __typename?: 'eventPassPricing', maxAmount: number, maxAmountPerUser?: number | null, priceAmount: number, priceCurrency: Types.Currency_Enum } | null, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null }> } | null };

export type GetEventPassesQueryVariables = Types.Exact<{
  eventSlug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassesQuery = { __typename?: 'query_root', eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, eventPassPricing?: { __typename?: 'eventPassPricing', maxAmount: number, maxAmountPerUser?: number | null, priceAmount: number, priceCurrency: Types.Currency_Enum } | null, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }> }> };

export type UpdateEventPassNftFromNftTransferMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassNft_Updates> | Types.EventPassNft_Updates;
}>;


export type UpdateEventPassNftFromNftTransferMutation = { __typename?: 'mutation_root', update_eventPassNft_many?: Array<{ __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, currentOwnerAddress?: string | null, eventId: string, eventPassId: string, organizerId: string, tokenId: any, lastNftTransfer?: { __typename?: 'nftTransfer', fromAddress: string } | null }> } | null> | null };

export type SetEventPassNftRevealedMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type SetEventPassNftRevealedMutation = { __typename?: 'mutation_root', update_eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any } | null };

export type InsertEventPassNftsMutationVariables = Types.Exact<{
  objects: Array<Types.EventPassNft_Insert_Input> | Types.EventPassNft_Insert_Input;
}>;


export type InsertEventPassNftsMutation = { __typename?: 'mutation_root', insert_eventPassNft?: { __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', contractAddress: string, tokenId: any, metadata: any, error?: string | null, tokenUri?: string | null, chainId: string, eventId: string, eventPassId: string, organizerId: string, currentOwnerAddress?: string | null, lastNftTransferId?: any | null, isRevealed: boolean, id: any, created_at: any, updated_at: any }> } | null };

export type ClaimEventPassNftsMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassNft_Updates> | Types.EventPassNft_Updates;
}>;


export type ClaimEventPassNftsMutation = { __typename?: 'mutation_root', update_eventPassNft_many?: Array<{ __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', id: any, currentOwnerAddress?: string | null, eventId: string, eventPassId: string, organizerId: string, tokenId: any }> } | null> | null };

export type GetEventPassNftByContractsAndTokenIdsQueryVariables = Types.Exact<{
  contractAddresses: Array<Types.Scalars['String']> | Types.Scalars['String'];
  chainId: Types.Scalars['String'];
  tokenIds: Array<Types.Scalars['bigint']> | Types.Scalars['bigint'];
}>;


export type GetEventPassNftByContractsAndTokenIdsQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string }> };

export type CreateEventPassNftContractMutationVariables = Types.Exact<{
  object: Types.EventPassNftContract_Insert_Input;
}>;


export type CreateEventPassNftContractMutation = { __typename?: 'mutation_root', insert_eventPassNftContract_one?: { __typename?: 'eventPassNftContract', chainId: string, contractAddress: string, eventId: string, eventPassId: string, organizerId: string } | null };

export type GetContractAddressFromEventPassIdQueryVariables = Types.Exact<{
  eventPassId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetContractAddressFromEventPassIdQuery = { __typename?: 'query_root', eventPassNftContract: Array<{ __typename?: 'eventPassNftContract', contractAddress: string }> };

export type GetEventPassOrderSumsQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String'];
}>;


export type GetEventPassOrderSumsQuery = { __typename?: 'query_root', eventPassOrderSums_by_pk?: { __typename?: 'eventPassOrderSums', totalReserved: number } | null };

export type CreateEventPassPricingMutationVariables = Types.Exact<{
  eventPassPricing: Types.EventPassPricing_Insert_Input;
}>;


export type CreateEventPassPricingMutation = { __typename?: 'mutation_root', insert_eventPassPricing_one?: { __typename?: 'eventPassPricing', id: any, eventPassId: string, priceAmount: number, priceCurrency: Types.Currency_Enum, maxAmount: number, maxAmountPerUser?: number | null } | null };

export type UpdateEventPassPricingMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
  eventPassPricing: Types.EventPassPricing_Set_Input;
}>;


export type UpdateEventPassPricingMutation = { __typename?: 'mutation_root', update_eventPassPricing_by_pk?: { __typename?: 'eventPassPricing', id: any, eventPassId: string, priceAmount: number, priceCurrency: Types.Currency_Enum, maxAmount: number, maxAmountPerUser?: number | null } | null };

export type DeleteFollowOrganizerMutationVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  organizerSlug: Types.Scalars['String'];
}>;


export type DeleteFollowOrganizerMutation = { __typename?: 'mutation_root', delete_follow_by_pk?: { __typename?: 'follow', organizerSlug: string } | null };

export type CheckFollowingOrganizerQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  organizerSlug: Types.Scalars['String'];
}>;


export type CheckFollowingOrganizerQuery = { __typename?: 'query_root', follow_by_pk?: { __typename?: 'follow', accountId: any, organizerSlug: string } | null };

export type GetOrganizerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetOrganizerQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', slug: string, name: string, imageClasses?: string | null, heroImageClasses?: string | null, twitterHandle?: string | null, instagramHandle?: string | null, tiktokHandle?: string | null, facebookHandle?: string | null, youtubeHandle?: string | null, telegramHandle?: string | null, discordWidgetId?: string | null, description?: { __typename?: 'OrganizerDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> } | null, image: { __typename?: 'Asset', url: string }, heroImage: { __typename?: 'Asset', url: string } } | null };

export type GetOrganizerFromSlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  stage: Types.Stage;
}>;


export type GetOrganizerFromSlugQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', id: string, slug: string } | null };

export type GetOrganizerLatestEventsQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetOrganizerLatestEventsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', id: any, tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null };

export type InsertEventParametersMutationVariables = Types.Exact<{
  objects: Array<Types.EventParameters_Insert_Input> | Types.EventParameters_Insert_Input;
}>;


export type InsertEventParametersMutation = { __typename?: 'mutation_root', insert_eventParameters?: { __typename?: 'eventParameters_mutation_response', returning: Array<{ __typename?: 'eventParameters', id: any, activityWebhookId?: string | null, eventId: string }> } | null };

export type GetAlchemyInfosFromEventIdQueryVariables = Types.Exact<{
  eventId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetAlchemyInfosFromEventIdQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', activityWebhookId?: string | null, signingKey?: string | null }> };

export type GetEventPassNftByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByIdQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null } | null } | null };

export type GetEventPassNftByIdMinimalQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type GetEventPassNftByIdMinimalQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null } | null };

export type RoleAssignmentsFieldsFragment = { __typename?: 'roleAssignments', role: Types.Roles_Enum, organizerId: string, eventId: string };

export type CreateRoleAssignmentMutationVariables = Types.Exact<{
  input: Types.RoleAssignments_Insert_Input;
}>;


export type CreateRoleAssignmentMutation = { __typename?: 'mutation_root', insert_roleAssignments_one?: { __typename?: 'roleAssignments', role: Types.Roles_Enum } | null };

export type GetRoleMinimalQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  role: Types.Roles_Enum;
  organizerId: Types.Scalars['String'];
  eventId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetRoleMinimalQuery = { __typename?: 'query_root', roleAssignments: Array<{ __typename?: 'roleAssignments', id: any }> };

export type StripeCheckoutSessionFieldsFragment = { __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum };

export type StripeCustomerFieldsFragment = { __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any };

export type CreateStripeCheckoutSessionMutationVariables = Types.Exact<{
  stripeCheckoutSession: Types.StripeCheckoutSession_Insert_Input;
}>;


export type CreateStripeCheckoutSessionMutation = { __typename?: 'mutation_root', insert_stripeCheckoutSession_one?: { __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum } | null };

export type DeleteStripeCheckoutSessionMutationVariables = Types.Exact<{
  stripeSessionId: Types.Scalars['String'];
}>;


export type DeleteStripeCheckoutSessionMutation = { __typename?: 'mutation_root', delete_stripeCheckoutSession_by_pk?: { __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum } | null };

export type GetStripeCheckoutSessionForUserQueryVariables = Types.Exact<{
  stripeCustomerId: Types.Scalars['String'];
}>;


export type GetStripeCheckoutSessionForUserQuery = { __typename?: 'query_root', stripeCheckoutSession: Array<{ __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum }> };

export type CreateStripeCustomerMutationVariables = Types.Exact<{
  stripeCustomer: Types.StripeCustomer_Insert_Input;
}>;


export type CreateStripeCustomerMutation = { __typename?: 'mutation_root', insert_stripeCustomer_one?: { __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any } | null };

export type UpdateStripeCustomerMutationVariables = Types.Exact<{
  stripeCustomerId: Types.Scalars['String'];
  stripeCustomer: Types.StripeCustomer_Set_Input;
}>;


export type UpdateStripeCustomerMutation = { __typename?: 'mutation_root', update_stripeCustomer_by_pk?: { __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any } | null };

export type GetStripeCustomerByAccountQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
}>;


export type GetStripeCustomerByAccountQuery = { __typename?: 'query_root', stripeCustomer: Array<{ __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any }> };
