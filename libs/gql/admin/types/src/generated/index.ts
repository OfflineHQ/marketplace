import * as Types from '@gql/shared/types';

export type AccountFieldsFragment = { __typename?: 'account', id: any, address: string };

export type UpdateAccountMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  account: Types.Account_Set_Input;
}>;


export type UpdateAccountMutation = { __typename?: 'mutation_root', update_account_by_pk?: { __typename?: 'account', id: any, address: string } | null };

export type CreateAccountMutationVariables = Types.Exact<{
  account: Types.Account_Insert_Input;
}>;


export type CreateAccountMutation = { __typename?: 'mutation_root', insert_account_one?: { __typename?: 'account', id: any, address: string } | null };

export type GetAccountQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
}>;


export type GetAccountQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, kyc?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null, roles: Array<{ __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string }> }> };

export type GetAccountByAddressQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
}>;


export type GetAccountByAddressQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string }> };

export type GetAccountByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type GetAccountByIdQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', address: string }> };

export type UpdateOrdersStatusMutationVariables = Types.Exact<{
  updates: Array<Types.Order_Updates> | Types.Order_Updates;
}>;


export type UpdateOrdersStatusMutation = { __typename?: 'mutation_root', update_order_many?: Array<{ __typename?: 'order_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'order', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId?: string | null, packId?: string | null, accountId: any, created_at: any }> } | null> | null };

export type SetOrdersStripeCheckoutSessionIdMutationVariables = Types.Exact<{
  updates: Array<Types.Order_Updates> | Types.Order_Updates;
}>;


export type SetOrdersStripeCheckoutSessionIdMutation = { __typename?: 'mutation_root', update_order_many?: Array<{ __typename?: 'order_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'order', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId?: string | null, packId?: string | null, accountId: any, created_at: any, stripeCheckoutSessionId?: string | null }> } | null> | null };

export type MovePendingOrdersToConfirmedMutationVariables = Types.Exact<{
  pendingOrderIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
  objects: Array<Types.Order_Insert_Input> | Types.Order_Insert_Input;
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type MovePendingOrdersToConfirmedMutation = { __typename?: 'mutation_root', delete_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', affected_rows: number } | null, insert_order?: { __typename?: 'order_mutation_response', returning: Array<{ __typename?: 'order', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId?: string | null, packId?: string | null, accountId: any, created_at: any, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, eventPass?: { __typename?: 'EventPass', id: string, name: string, nftImage: { __typename?: 'Asset', url: string }, event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> } | null };

export type GetAccountOrderForEventPassesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid']['input'];
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAccountOrderForEventPassesQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, created_at: any }> };

export type GetOrderFromIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type GetOrderFromIdQuery = { __typename?: 'query_root', order_by_pk?: { __typename?: 'order', id: any, eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, packNftContract?: { __typename?: 'packNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null, passPricing?: { __typename?: 'passPricing', amount: number } | null } | null };

export type GetOrdersFromStripeCheckoutSessionQueryVariables = Types.Exact<{
  stripeCheckoutSessionId: Types.Scalars['String']['input'];
}>;


export type GetOrdersFromStripeCheckoutSessionQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', id: any, eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, packNftContract?: { __typename?: 'packNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null, passPricing?: { __typename?: 'passPricing', amount: number } | null }> };

export type GetOrdersWithClaimInfoQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type GetOrdersWithClaimInfoQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', id: any, eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, packNftContract?: { __typename?: 'packNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null }> };

export type DeletePendingOrdersMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type DeletePendingOrdersMutation = { __typename?: 'mutation_root', delete_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', affected_rows: number } | null };

export type GetPendingOrdersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetPendingOrdersQuery = { __typename?: 'query_root', pendingOrder: Array<{ __typename?: 'pendingOrder', created_at: any, id: any, eventPassId?: string | null, packId?: string | null, account?: { __typename?: 'account', address: string } | null, passAmount?: { __typename?: 'passAmount', timeBeforeDelete: number } | null, packAmount?: { __typename?: 'passAmount', timeBeforeDelete: number } | null }> };

export type KycFieldsFragment = { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null };

export type CreateKycMutationVariables = Types.Exact<{
  kyc: Types.Kyc_Insert_Input;
}>;


export type CreateKycMutation = { __typename?: 'mutation_root', insert_kyc_one?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null };

export type UpdateKycMutationVariables = Types.Exact<{
  externalUserId: Types.Scalars['uuid']['input'];
  kyc: Types.Kyc_Set_Input;
}>;


export type UpdateKycMutation = { __typename?: 'mutation_root', update_kyc_by_pk?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null };

export type DeleteKycMutationVariables = Types.Exact<{
  externalUserId: Types.Scalars['uuid']['input'];
}>;


export type DeleteKycMutation = { __typename?: 'mutation_root', delete_kyc_by_pk?: { __typename?: 'kyc', externalUserId: any } | null };

export type NftTransferFieldsFragment = { __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId?: string | null, organizerId: string, eventPassId?: string | null, packId?: string | null, packAmount?: number | null, tokenId: any, created_at: any };

export type UpsertNftTransferMutationVariables = Types.Exact<{
  objects: Array<Types.NftTransfer_Insert_Input> | Types.NftTransfer_Insert_Input;
}>;


export type UpsertNftTransferMutation = { __typename?: 'mutation_root', insert_nftTransfer?: { __typename?: 'nftTransfer_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId?: string | null, organizerId: string, eventPassId?: string | null, packId?: string | null, packAmount?: number | null, tokenId: any, created_at: any }> } | null };

export type GetNftTransferByTxHashQueryVariables = Types.Exact<{
  txHash: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
}>;


export type GetNftTransferByTxHashQuery = { __typename?: 'query_root', nftTransfer: Array<{ __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId?: string | null, organizerId: string, eventPassId?: string | null, packId?: string | null, packAmount?: number | null, tokenId: any, created_at: any }> };

export type GetNftTransferByTokenIdAndCollectionQueryVariables = Types.Exact<{
  tokenId: Types.Scalars['bigint']['input'];
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
}>;


export type GetNftTransferByTokenIdAndCollectionQuery = { __typename?: 'query_root', nftTransfer: Array<{ __typename?: 'nftTransfer', id: any, contractAddress: string, fromAddress: string, toAddress: string, transactionHash: string, chainId: string, blockNumber: any, eventId?: string | null, organizerId: string, eventPassId?: string | null, packId?: string | null, packAmount?: number | null, tokenId: any, created_at: any }> };

export type OrganizerFieldsFragment = { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } };

export type ContentSpaceFieldsFragment = { __typename?: 'ContentSpace', title: string, slug?: string | null, heroImage: { __typename?: 'Asset', url: string }, description: { __typename?: 'ContentSpaceDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> } };

export type GetContentSpacesFromOrganizerIdTableQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetContentSpacesFromOrganizerIdTableQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', contentSpaces: Array<{ __typename?: 'ContentSpace', slug?: string | null, title: string, contentSpaceParameters?: { __typename?: 'contentSpaceParameters', status?: Types.ContentSpaceStatus_Enum | null } | null }> } | null };

export type GetContentSpaceWithPassesOrganizerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetContentSpaceWithPassesOrganizerQuery = { __typename?: 'query_root', contentSpace?: { __typename?: 'ContentSpace', title: string, slug?: string | null, id: string, contentSpaceParameters?: { __typename?: 'contentSpaceParameters', status?: Types.ContentSpaceStatus_Enum | null } | null, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, event?: { __typename?: 'Event', slug: string, title: string } | null }> } | null };

export type CreateContentSpaceParametersMutationVariables = Types.Exact<{
  object: Types.ContentSpaceParameters_Insert_Input;
}>;


export type CreateContentSpaceParametersMutation = { __typename?: 'mutation_root', insert_contentSpaceParameters_one?: { __typename?: 'contentSpaceParameters', id: any } | null };

export type EventDateLocationsFieldsFragment = { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } };

export type EventListFieldsFragment = { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', width?: number | null, height?: number | null, url: string } };

export type EventParametersFieldsFragment = { __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, dateSaleStart?: any | null, dateSaleEnd?: any | null, timezone: string, isSaleOngoing?: boolean | null, isOngoing?: boolean | null, status?: Types.EventStatus_Enum | null };

export type EventParametersMinimalFieldsFragment = { __typename?: 'eventParameters', status?: Types.EventStatus_Enum | null };

export type PassAmountFieldsFragment = { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number };

export type PassPricingFieldsFragment = { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum };

export type GetEventQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, description: { __typename?: 'EventDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, eventParameters?: { __typename?: 'eventParameters', dateSaleStart?: any | null, dateSaleEnd?: any | null, dateStart?: any | null, dateEnd?: any | null, timezone: string, status?: Types.EventStatus_Enum | null } | null, eventDateLocations: Array<{ __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } }>, heroImage: { __typename?: 'Asset', width?: number | null, height?: number | null, url: string } } | null };

export type GetEventWithPassesQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null, eventDateLocations: Array<{ __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } }>, eventParameters?: { __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, dateSaleStart?: any | null, dateSaleEnd?: any | null, timezone: string, isSaleOngoing?: boolean | null, isOngoing?: boolean | null, status?: Types.EventStatus_Enum | null } | null, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, passAmount?: { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number } | null, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null }> } | null };

export type GetEventsFromOrganizerIdTableQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventsFromOrganizerIdTableQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', events: Array<{ __typename?: 'Event', title: string, slug: string, eventParameters?: { __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, dateSaleStart?: any | null, dateSaleEnd?: any | null, timezone: string, status?: Types.EventStatus_Enum | null, isSaleOngoing?: boolean | null, isOngoing?: boolean | null } | null }> } | null };

export type GetEventWithPassesOrganizerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesOrganizerQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', title: string, id: string, slug: string, eventParameters?: { __typename?: 'eventParameters', status?: Types.EventStatus_Enum | null } | null, eventPasses: Array<{ __typename?: 'EventPass', name: string, id: string, description: string, nftName: string, nftDescription: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passAmount?: { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number } | null, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, eventPassNftContract?: { __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, contractAddress: string, eventPassId: string, isDelayedRevealed: boolean } | null, eventPassDelayedRevealed?: { __typename?: 'EventPassDelayedRevealed', name: string, description: string, nftName: string, nftDescription: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }> } | null }> } | null };

export type CreateEventParametersMutationVariables = Types.Exact<{
  object: Types.EventParameters_Insert_Input;
}>;


export type CreateEventParametersMutation = { __typename?: 'mutation_root', insert_eventParameters_one?: { __typename?: 'eventParameters', id: any, activityWebhookId?: string | null, eventId: string } | null };

export type GetAlchemyInfosFromEventIdQueryVariables = Types.Exact<{
  eventId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetAlchemyInfosFromEventIdQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', activityWebhookId?: string | null, activityWebhookSigningKey?: string | null, metadataUpdateWebhookId?: string | null, metadataUpdateWebhookSigningKey?: string | null }> };

export type GetEventParametersQueryVariables = Types.Exact<{
  eventId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEventParametersQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, dateSaleStart?: any | null, dateSaleEnd?: any | null, timezone: string, status?: Types.EventStatus_Enum | null, isSaleOngoing?: boolean | null, isOngoing?: boolean | null }> };

export type GetEventParametersFromEventPassIdsQueryVariables = Types.Exact<{
  eventPassIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type GetEventParametersFromEventPassIdsQuery = { __typename?: 'query_root', eventPasses: Array<{ __typename?: 'EventPass', id: string, event?: { __typename?: 'Event', eventParameters?: { __typename?: 'eventParameters', isSaleOngoing?: boolean | null } | null } | null }> };

export type GetEventParametersAndEventPassesQueryVariables = Types.Exact<{
  eventSlug: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventParametersAndEventPassesQuery = { __typename?: 'query_root', eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passAmount?: { __typename?: 'passAmount', maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number } | null, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, eventPassNftContract?: { __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, isDelayedRevealed: boolean } | null }>, event?: { __typename?: 'Event', title: string, organizer?: { __typename?: 'Organizer', slug: string } | null, eventParameters?: { __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, dateSaleStart?: any | null, dateSaleEnd?: any | null, timezone: string, isSaleOngoing?: boolean | null, isOngoing?: boolean | null, status?: Types.EventStatus_Enum | null } | null } | null };

export type GetEventPassDelayedRevealedFromEventPassIdQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['ID']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassDelayedRevealedFromEventPassIdQuery = { __typename?: 'query_root', eventPass?: { __typename?: 'EventPass', eventPassDelayedRevealed?: { __typename?: 'EventPassDelayedRevealed', name: string, description: string, nftName: string, nftDescription: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }> } | null } | null };

export type UpdateEventPassNftFromNftTransferMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassNft_Updates> | Types.EventPassNft_Updates;
}>;


export type UpdateEventPassNftFromNftTransferMutation = { __typename?: 'mutation_root', update_eventPassNft_many?: Array<{ __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, currentOwnerAddress?: string | null, eventId: string, eventPassId: string, organizerId: string, tokenId?: any | null, lastNftTransfer?: { __typename?: 'nftTransfer', fromAddress: string } | null }> } | null> | null };

export type SetEventPassNftRevealedMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type SetEventPassNftRevealedMutation = { __typename?: 'mutation_root', update_eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any } | null };

export type InsertEventPassNftsMutationVariables = Types.Exact<{
  objects: Array<Types.EventPassNft_Insert_Input> | Types.EventPassNft_Insert_Input;
}>;


export type InsertEventPassNftsMutation = { __typename?: 'mutation_root', insert_eventPassNft?: { __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', contractAddress: string, tokenId?: any | null, metadata?: any | null, error?: string | null, tokenUri?: string | null, chainId: string, eventId: string, eventPassId: string, organizerId: string, currentOwnerAddress?: string | null, lastNftTransferId?: any | null, isRevealed: boolean, id: any, created_at: any, updated_at: any }> } | null };

export type ClaimEventPassNftsMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassNft_Updates> | Types.EventPassNft_Updates;
}>;


export type ClaimEventPassNftsMutation = { __typename?: 'mutation_root', update_eventPassNft_many?: Array<{ __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', id: any, currentOwnerAddress?: string | null, eventId: string, eventPassId: string, organizerId: string, tokenId?: any | null }> } | null> | null };

export type UpdateNftsWithPackIdMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassNft_Updates> | Types.EventPassNft_Updates;
}>;


export type UpdateNftsWithPackIdMutation = { __typename?: 'mutation_root', update_eventPassNft_many?: Array<{ __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', id: any, contractAddress: string, tokenId?: any | null, packId?: string | null }> } | null> | null };

export type GetEventPassNftByContractsAndTokenIdsQueryVariables = Types.Exact<{
  contractAddresses: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
  tokenIds: Array<Types.Scalars['bigint']['input']> | Types.Scalars['bigint']['input'];
}>;


export type GetEventPassNftByContractsAndTokenIdsQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId?: any | null, eventId: string, eventPassId: string, organizerId: string }> };

export type GetListCurrentOwnerAddressForContractAddressQueryVariables = Types.Exact<{
  contractAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetListCurrentOwnerAddressForContractAddressQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', currentOwnerAddress?: string | null, tokenId?: any | null }> };

export type CreateEventPassNftContractMutationVariables = Types.Exact<{
  object: Types.EventPassNftContract_Insert_Input;
}>;


export type CreateEventPassNftContractMutation = { __typename?: 'mutation_root', insert_eventPassNftContract_one?: { __typename?: 'eventPassNftContract', chainId: string, contractAddress: string, eventId: string, eventPassId: string, organizerId: string } | null };

export type UpdateEventPassNftContractDelayedRevealStatusMutationVariables = Types.Exact<{
  contractAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpdateEventPassNftContractDelayedRevealStatusMutation = { __typename?: 'mutation_root', update_eventPassNftContract?: { __typename?: 'eventPassNftContract_mutation_response', affected_rows: number } | null };

export type GetContractAddressFromEventPassIdQueryVariables = Types.Exact<{
  eventPassId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetContractAddressFromEventPassIdQuery = { __typename?: 'query_root', eventPassNftContract: Array<{ __typename?: 'eventPassNftContract', contractAddress: string }> };

export type GetEventPassNftContractDelayedRevealedFromEventPassIdQueryVariables = Types.Exact<{
  eventPassId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEventPassNftContractDelayedRevealedFromEventPassIdQuery = { __typename?: 'query_root', eventPassNftContract: Array<{ __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, isDelayedRevealed: boolean }> };

export type GetEventPassNftContractDelayedRevealPasswordQueryVariables = Types.Exact<{
  contractAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEventPassNftContractDelayedRevealPasswordQuery = { __typename?: 'query_root', eventPassNftContract: Array<{ __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, isDelayedRevealed: boolean, password?: string | null }> };

export type GetEventPassNftContractNftsLazyMintedQueryVariables = Types.Exact<{
  eventPassId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetEventPassNftContractNftsLazyMintedQuery = { __typename?: 'query_root', eventPassNftContract: Array<{ __typename?: 'eventPassNftContract', contractAddress: string, eventPassId: string, eventPassNfts: Array<{ __typename?: 'eventPassNft', id: any, packId?: string | null, currentOwnerAddress?: string | null, contractAddress: string, eventId: string, tokenId?: any | null, eventPassId: string, status?: Types.NftStatus_Enum | null }> }> };

export type GetEventPassOrderSumsQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String']['input'];
}>;


export type GetEventPassOrderSumsQuery = { __typename?: 'query_root', eventPassOrderSums_by_pk?: { __typename?: 'eventPassOrderSums', totalReserved: number } | null };

export type CreatePackNftContractMutationVariables = Types.Exact<{
  object: Types.PackNftContract_Insert_Input;
}>;


export type CreatePackNftContractMutation = { __typename?: 'mutation_root', insert_packNftContract_one?: { __typename?: 'packNftContract', id: any, chainId: string, contractAddress: string, organizerId: string, rewardsPerPack: number, packId: string } | null };

export type GetPackNftContractFromPackIdQueryVariables = Types.Exact<{
  packId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetPackNftContractFromPackIdQuery = { __typename?: 'query_root', packNftContract: Array<{ __typename?: 'packNftContract', id: any, chainId: string, rewardsPerPack: number, organizerId: string, contractAddress: string, lotteryId: string, eventPassNftContracts: Array<{ __typename?: 'packNftContractEventPass', eventPassId: string, amount: number }>, eventPassNfts: Array<{ __typename?: 'eventPassNft', tokenId?: any | null, contractAddress: string, currentOwnerAddress?: string | null, eventPassId: string, packId?: string | null }> }> };

export type CreatePackNftContractEventPassesMutationVariables = Types.Exact<{
  objects: Array<Types.PackNftContractEventPass_Insert_Input> | Types.PackNftContractEventPass_Insert_Input;
}>;


export type CreatePackNftContractEventPassesMutation = { __typename?: 'mutation_root', insert_packNftContractEventPass?: { __typename?: 'packNftContractEventPass_mutation_response', returning: Array<{ __typename?: 'packNftContractEventPass', packNftContractId: any, eventPassId: string, amount: number }> } | null };

export type CreatePassAmountMutationVariables = Types.Exact<{
  passAmount: Types.PassAmount_Insert_Input;
}>;


export type CreatePassAmountMutation = { __typename?: 'mutation_root', insert_passAmount_one?: { __typename?: 'passAmount', id: any, eventPassId?: string | null, packId?: string | null, maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number } | null };

export type UpdatePassAmountMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  passAmount: Types.PassAmount_Set_Input;
}>;


export type UpdatePassAmountMutation = { __typename?: 'mutation_root', update_passAmount_by_pk?: { __typename?: 'passAmount', id: any, eventPassId?: string | null, packId?: string | null, maxAmount: number, maxAmountPerUser?: number | null, timeBeforeDelete: number } | null };

export type CreatePassPricingMutationVariables = Types.Exact<{
  passPricing: Types.PassPricing_Insert_Input;
}>;


export type CreatePassPricingMutation = { __typename?: 'mutation_root', insert_passPricing_one?: { __typename?: 'passPricing', id: any, eventPassId?: string | null, packId?: string | null, amount: number, currency: Types.Currency_Enum } | null };

export type UpdatePassPricingMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  passPricing: Types.PassPricing_Set_Input;
}>;


export type UpdatePassPricingMutation = { __typename?: 'mutation_root', update_passPricing_by_pk?: { __typename?: 'passPricing', id: any, eventPassId?: string | null, packId?: string | null, amount: number, currency: Types.Currency_Enum } | null };

export type DeleteFollowOrganizerMutationVariables = Types.Exact<{
  accountId: Types.Scalars['uuid']['input'];
  organizerSlug: Types.Scalars['String']['input'];
}>;


export type DeleteFollowOrganizerMutation = { __typename?: 'mutation_root', delete_follow_by_pk?: { __typename?: 'follow', organizerSlug: string } | null };

export type CheckFollowingOrganizerQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid']['input'];
  organizerSlug: Types.Scalars['String']['input'];
}>;


export type CheckFollowingOrganizerQuery = { __typename?: 'query_root', follow_by_pk?: { __typename?: 'follow', accountId: any, organizerSlug: string } | null };

export type InsertLoyaltyCardNftContractMutationVariables = Types.Exact<{
  object: Types.LoyaltyCardNftContract_Insert_Input;
}>;


export type InsertLoyaltyCardNftContractMutation = { __typename?: 'mutation_root', insert_loyaltyCardNftContract_one?: { __typename?: 'loyaltyCardNftContract', id: any } | null };

export type CreateLoyaltyCardParametersMutationVariables = Types.Exact<{
  object: Types.LoyaltyCardParameters_Insert_Input;
}>;


export type CreateLoyaltyCardParametersMutation = { __typename?: 'mutation_root', insert_loyaltyCardParameters_one?: { __typename?: 'loyaltyCardParameters', id: any } | null };

export type UpdateLoyaltyCardParametersMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  object: Types.LoyaltyCardParameters_Set_Input;
}>;


export type UpdateLoyaltyCardParametersMutation = { __typename?: 'mutation_root', update_loyaltyCardParameters_by_pk?: { __typename?: 'loyaltyCardParameters', id: any } | null };

export type InsertLoyaltyCardNftMutationVariables = Types.Exact<{
  object: Types.LoyaltyCardNft_Insert_Input;
}>;


export type InsertLoyaltyCardNftMutation = { __typename?: 'mutation_root', insert_loyaltyCardNft_one?: { __typename?: 'loyaltyCardNft', id: any } | null };

export type UpdateLoyaltyCardNftMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  object: Types.LoyaltyCardNft_Set_Input;
}>;


export type UpdateLoyaltyCardNftMutation = { __typename?: 'mutation_root', update_loyaltyCardNft_by_pk?: { __typename?: 'loyaltyCardNft', id: any } | null };

export type UpdateLoyaltyCardNftsMutationVariables = Types.Exact<{
  updates: Array<Types.LoyaltyCardNft_Updates> | Types.LoyaltyCardNft_Updates;
}>;


export type UpdateLoyaltyCardNftsMutation = { __typename?: 'mutation_root', update_loyaltyCardNft_many?: Array<{ __typename?: 'loyaltyCardNft_mutation_response', affected_rows: number } | null> | null };

export type GetLoyaltyCardOrganizerQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['ID']['input'];
  stage: Types.Stage;
}>;


export type GetLoyaltyCardOrganizerQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', loyaltyCard?: { __typename?: 'LoyaltyCard', id: string, nftName: string, nftImage: { __typename?: 'Asset', url: string }, loyaltyCardParameters?: { __typename?: 'loyaltyCardParameters', status?: Types.LoyaltyCardStatus_Enum | null } | null, loyaltyCardNftContract?: { __typename?: 'loyaltyCardNftContract', contractAddress: string, chainId: string } | null } | null } | null };

export type GetLoyaltyCardNftContractByLoyaltyCardIdQueryVariables = Types.Exact<{
  loyaltyCardId: Types.Scalars['String']['input'];
}>;


export type GetLoyaltyCardNftContractByLoyaltyCardIdQuery = { __typename?: 'query_root', loyaltyCardNftContract: Array<{ __typename?: 'loyaltyCardNftContract', contractAddress: string, chainId: string }> };

export type GetAlchemyInfosFromLoyaltyCardIdQueryVariables = Types.Exact<{
  loyaltyCardId: Types.Scalars['String']['input'];
}>;


export type GetAlchemyInfosFromLoyaltyCardIdQuery = { __typename?: 'query_root', loyaltyCardParameters: Array<{ __typename?: 'loyaltyCardParameters', id: any, activityWebhookId?: string | null, activityWebhookSigningKey?: string | null, metadataUpdateWebhookId?: string | null, metadataUpdateWebhookSigningKey?: string | null }> };

export type GetLoyaltyCardOwnedByAddressQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
  ownerAddress: Types.Scalars['String']['input'];
  organizerId: Types.Scalars['String']['input'];
}>;


export type GetLoyaltyCardOwnedByAddressQuery = { __typename?: 'query_root', loyaltyCardNft: Array<{ __typename?: 'loyaltyCardNft', id: any, status?: Types.NftStatus_Enum | null, burnedTransferId?: any | null, organizerId: string }> };

export type GetLoyaltyCardAlchemyEventQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
  tokenId: Types.Scalars['bigint']['input'];
}>;


export type GetLoyaltyCardAlchemyEventQuery = { __typename?: 'query_root', loyaltyCardNft: Array<{ __typename?: 'loyaltyCardNft', id: any, status?: Types.NftStatus_Enum | null }> };

export type GetLoyaltyCardNftContractByContractAddressQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
  organizerId: Types.Scalars['String']['input'];
}>;


export type GetLoyaltyCardNftContractByContractAddressQuery = { __typename?: 'query_root', loyaltyCardNftContract: Array<{ __typename?: 'loyaltyCardNftContract', loyaltyCardId: string }> };

export type GetLoyaltyCardByContractAddressForProcessQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLoyaltyCardByContractAddressForProcessQuery = { __typename?: 'query_root', loyaltyCardNft: Array<{ __typename?: 'loyaltyCardNft', id: any, status?: Types.NftStatus_Enum | null, updated_at: any, contractAddress: string, ownerAddress: string, loyaltyCardId: string, metadata?: any | null, tokenId?: any | null }> };

export type InsertMinterTemporaryWalletMutationVariables = Types.Exact<{
  object: Types.MinterTemporaryWallet_Insert_Input;
}>;


export type InsertMinterTemporaryWalletMutation = { __typename?: 'mutation_root', insert_minterTemporaryWallet_one?: { __typename?: 'minterTemporaryWallet', address: string, eventPassId?: string | null, packId?: string | null, loyaltyCardId?: string | null, campaignId?: string | null } | null };

export type InsertMinterTemporaryWalletsMutationVariables = Types.Exact<{
  objects: Array<Types.MinterTemporaryWallet_Insert_Input> | Types.MinterTemporaryWallet_Insert_Input;
}>;


export type InsertMinterTemporaryWalletsMutation = { __typename?: 'mutation_root', insert_minterTemporaryWallet?: { __typename?: 'minterTemporaryWallet_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'minterTemporaryWallet', address: string, eventPassId?: string | null, packId?: string | null, loyaltyCardId?: string | null, campaignId?: string | null }> } | null };

export type GetMinterTemporaryWalletByEventPassIdQueryVariables = Types.Exact<{
  eventPassId: Types.Scalars['String']['input'];
}>;


export type GetMinterTemporaryWalletByEventPassIdQuery = { __typename?: 'query_root', minterTemporaryWallet: Array<{ __typename?: 'minterTemporaryWallet', address: string, privateKey: string, eventPassId?: string | null }> };

export type GetMinterTemporaryWalletByLoyaltyCardIdQueryVariables = Types.Exact<{
  loyaltyCardId: Types.Scalars['String']['input'];
}>;


export type GetMinterTemporaryWalletByLoyaltyCardIdQuery = { __typename?: 'query_root', minterTemporaryWallet: Array<{ __typename?: 'minterTemporaryWallet', address: string, privateKey: string, loyaltyCardId?: string | null }> };

export type GetMinterTemporaryWalletByCampaignIdQueryVariables = Types.Exact<{
  campaignId: Types.Scalars['String']['input'];
}>;


export type GetMinterTemporaryWalletByCampaignIdQuery = { __typename?: 'query_root', minterTemporaryWallet: Array<{ __typename?: 'minterTemporaryWallet', address: string, privateKey: string, campaignId?: string | null }> };

export type InsertNftMintPasswordMutationVariables = Types.Exact<{
  object: Types.NftMintPassword_Insert_Input;
}>;


export type InsertNftMintPasswordMutation = { __typename?: 'mutation_root', insert_nftMintPassword_one?: { __typename?: 'nftMintPassword', id: any } | null };

export type InsertNftMintPasswordsMutationVariables = Types.Exact<{
  objects: Array<Types.NftMintPassword_Insert_Input> | Types.NftMintPassword_Insert_Input;
}>;


export type InsertNftMintPasswordsMutation = { __typename?: 'mutation_root', insert_nftMintPassword?: { __typename?: 'nftMintPassword_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'nftMintPassword', id: any, password: string, tokenId?: any | null, minterAddress?: string | null }> } | null };

export type UpdateNftMintPasswordMinterMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  minterAddress: Types.Scalars['String']['input'];
}>;


export type UpdateNftMintPasswordMinterMutation = { __typename?: 'mutation_root', update_nftMintPassword_by_pk?: { __typename?: 'nftMintPassword', id: any } | null };

export type UpdateNftMintPasswordTokenIdMutationVariables = Types.Exact<{
  tokenId: Types.Scalars['bigint']['input'];
  minterAddress: Types.Scalars['String']['input'];
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
}>;


export type UpdateNftMintPasswordTokenIdMutation = { __typename?: 'mutation_root', update_nftMintPassword?: { __typename?: 'nftMintPassword_mutation_response', returning: Array<{ __typename?: 'nftMintPassword', id: any }> } | null };

export type GetNftMintPasswordsForContractQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
}>;


export type GetNftMintPasswordsForContractQuery = { __typename?: 'query_root', nftMintPassword: Array<{ __typename?: 'nftMintPassword', password: string, minterAddress?: string | null, created_at: any, updated_at: any }> };

export type GetNftMintPasswordsForContractAvailableQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String']['input'];
  chainId: Types.Scalars['String']['input'];
  organizerId: Types.Scalars['String']['input'];
}>;


export type GetNftMintPasswordsForContractAvailableQuery = { __typename?: 'query_root', nftMintPassword: Array<{ __typename?: 'nftMintPassword', id: any, password: string }> };

export type GetOrganizerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetOrganizerQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', slug: string, name: string, imageClasses?: string | null, heroImageClasses?: string | null, twitterHandle?: string | null, instagramHandle?: string | null, tiktokHandle?: string | null, facebookHandle?: string | null, youtubeHandle?: string | null, telegramHandle?: string | null, discordWidgetId?: string | null, description?: { __typename?: 'OrganizerDescriptionRichText', json: any, references: Array<{ __typename: 'Asset', id: string, url: string, mimeType?: string | null }> } | null, image: { __typename?: 'Asset', url: string }, heroImage: { __typename?: 'Asset', url: string } } | null };

export type GetOrganizerFromSlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  stage: Types.Stage;
}>;


export type GetOrganizerFromSlugQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', id: string, slug: string } | null };

export type GetOrganizerLatestEventsQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetOrganizerLatestEventsQuery = { __typename?: 'query_root', eventParameters: Array<{ __typename?: 'eventParameters', dateStart?: any | null, dateEnd?: any | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string } } | null }> };

export type GetShopifyCustomerQueryVariables = Types.Exact<{
  organizerId: Types.Scalars['String']['input'];
  customerId: Types.Scalars['String']['input'];
}>;


export type GetShopifyCustomerQuery = { __typename?: 'query_root', shopifyCustomer: Array<{ __typename?: 'shopifyCustomer', address: string }> };

export type InsertShopifyCustomerMutationVariables = Types.Exact<{
  object: Types.ShopifyCustomer_Insert_Input;
}>;


export type InsertShopifyCustomerMutation = { __typename?: 'mutation_root', insert_shopifyCustomer_one?: { __typename?: 'shopifyCustomer', id: any } | null };

export type GetShopifyDomainQueryVariables = Types.Exact<{
  domain: Types.Scalars['String']['input'];
}>;


export type GetShopifyDomainQuery = { __typename?: 'query_root', shopifyDomain_by_pk?: { __typename?: 'shopifyDomain', organizerId: string } | null };

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', id: any, tokenId?: any | null, eventId: string, eventPassId: string, packId?: string | null, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null };

export type GetEventPassNftByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByIdQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId?: any | null, eventId: string, eventPassId: string, packId?: string | null, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation?: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } | null }>, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImageClasses?: string | null, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, imageClasses?: string | null, image: { __typename?: 'Asset', url: string } } | null } | null } | null } | null };

export type GetEventPassNftByIdMinimalQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type GetEventPassNftByIdMinimalQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId?: any | null, eventId: string, eventPassId: string, packId?: string | null, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null } | null };

export type GetEventPassNftByIdWithEventPassNftContractQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type GetEventPassNftByIdWithEventPassNftContractQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId?: any | null, eventId: string, eventPassId: string, packId?: string | null, organizerId: string, isRevealed: boolean, currentOwnerAddress?: string | null, eventPassNftContract?: { __typename?: 'eventPassNftContract', type: Types.EventPassNftContractType_Enum, isDelayedRevealed: boolean } | null } | null };

export type CreatePublishableApiKeyMutationVariables = Types.Exact<{
  object: Types.PublishableApiKey_Insert_Input;
}>;


export type CreatePublishableApiKeyMutation = { __typename?: 'mutation_root', insert_publishableApiKey_one?: { __typename?: 'publishableApiKey', id: any, name?: string | null, apiKey: string, allowlist: string, organizerId: string, expiresAt?: any | null, type: Types.ApiKeyType_Enum } | null };

export type UpdatePublishableApiKeyMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  allowlist?: Types.InputMaybe<Types.Scalars['String']['input']>;
  expiresAt?: Types.InputMaybe<Types.Scalars['timestamptz']['input']>;
  status?: Types.InputMaybe<Types.ApiKeyStatus_Enum>;
}>;


export type UpdatePublishableApiKeyMutation = { __typename?: 'mutation_root', update_publishableApiKey_by_pk?: { __typename?: 'publishableApiKey', name?: string | null, allowlist: string, organizerId: string, expiresAt?: any | null } | null };

export type GetPublishableApiKeyQueryVariables = Types.Exact<{
  apiKey: Types.Scalars['String']['input'];
}>;


export type GetPublishableApiKeyQuery = { __typename?: 'query_root', publishableApiKey: Array<{ __typename?: 'publishableApiKey', id: any, allowlist: string, organizerId: string, expiresAt?: any | null, status?: Types.ApiKeyStatus_Enum | null, type: Types.ApiKeyType_Enum }> };

export type CreateSecretApiKeyMutationVariables = Types.Exact<{
  object: Types.SecretApiKey_Insert_Input;
}>;


export type CreateSecretApiKeyMutation = { __typename?: 'mutation_root', insert_secretApiKey_one?: { __typename?: 'secretApiKey', id: any, name?: string | null, apiKey: string, hashedOriginSecret?: string | null, originSecretSalt?: string | null, encryptedIntegritySecret?: string | null, allowlist: string, organizerId: string, expiresAt?: any | null, type: Types.ApiKeyType_Enum } | null };

export type UpdateSecretApiKeyMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  allowlist?: Types.InputMaybe<Types.Scalars['String']['input']>;
  expiresAt?: Types.InputMaybe<Types.Scalars['timestamptz']['input']>;
  status?: Types.InputMaybe<Types.ApiKeyStatus_Enum>;
}>;


export type UpdateSecretApiKeyMutation = { __typename?: 'mutation_root', update_secretApiKey_by_pk?: { __typename?: 'secretApiKey', name?: string | null, hashedOriginSecret?: string | null, originSecretSalt?: string | null, encryptedIntegritySecret?: string | null, allowlist: string, organizerId: string, expiresAt?: any | null } | null };

export type GetSecretApiKeyQueryVariables = Types.Exact<{
  apiKey: Types.Scalars['String']['input'];
}>;


export type GetSecretApiKeyQuery = { __typename?: 'query_root', secretApiKey: Array<{ __typename?: 'secretApiKey', id: any, hashedOriginSecret?: string | null, originSecretSalt?: string | null, encryptedIntegritySecret?: string | null, allowlist: string, organizerId: string, expiresAt?: any | null, status?: Types.ApiKeyStatus_Enum | null, type: Types.ApiKeyType_Enum }> };

export type RoleAssignmentFieldsFragment = { __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string };

export type CreateRoleAssignmentMutationVariables = Types.Exact<{
  input: Types.RoleAssignment_Insert_Input;
}>;


export type CreateRoleAssignmentMutation = { __typename?: 'mutation_root', insert_roleAssignment_one?: { __typename?: 'roleAssignment', role: Types.Roles_Enum } | null };

export type GetRoleMinimalQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid']['input'];
  role: Types.Roles_Enum;
  organizerId: Types.Scalars['String']['input'];
  eventId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetRoleMinimalQuery = { __typename?: 'query_root', roleAssignment: Array<{ __typename?: 'roleAssignment', id: any }> };

export type StripeCheckoutSessionFieldsFragment = { __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum };

export type StripeCustomerFieldsFragment = { __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any };

export type CreateStripeCheckoutSessionMutationVariables = Types.Exact<{
  stripeCheckoutSession: Types.StripeCheckoutSession_Insert_Input;
}>;


export type CreateStripeCheckoutSessionMutation = { __typename?: 'mutation_root', insert_stripeCheckoutSession_one?: { __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum } | null };

export type DeleteStripeCheckoutSessionMutationVariables = Types.Exact<{
  stripeSessionId: Types.Scalars['String']['input'];
}>;


export type DeleteStripeCheckoutSessionMutation = { __typename?: 'mutation_root', delete_stripeCheckoutSession_by_pk?: { __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum } | null };

export type GetStripeCheckoutSessionForUserQueryVariables = Types.Exact<{
  stripeCustomerId: Types.Scalars['String']['input'];
}>;


export type GetStripeCheckoutSessionForUserQuery = { __typename?: 'query_root', stripeCheckoutSession: Array<{ __typename?: 'stripeCheckoutSession', stripeSessionId: string, stripeCustomerId: string, type: Types.StripeCheckoutSessionType_Enum }> };

export type CreateStripeCustomerMutationVariables = Types.Exact<{
  stripeCustomer: Types.StripeCustomer_Insert_Input;
}>;


export type CreateStripeCustomerMutation = { __typename?: 'mutation_root', insert_stripeCustomer_one?: { __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any } | null };

export type UpdateStripeCustomerMutationVariables = Types.Exact<{
  stripeCustomerId: Types.Scalars['String']['input'];
  stripeCustomer: Types.StripeCustomer_Set_Input;
}>;


export type UpdateStripeCustomerMutation = { __typename?: 'mutation_root', update_stripeCustomer_by_pk?: { __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any } | null };

export type GetStripeCustomerByAccountQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid']['input'];
}>;


export type GetStripeCustomerByAccountQuery = { __typename?: 'query_root', stripeCustomer: Array<{ __typename?: 'stripeCustomer', stripeCustomerId: string, accountId: any }> };
