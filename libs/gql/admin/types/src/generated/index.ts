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

export type UpsertEventPassOrdersMutationVariables = Types.Exact<{
  objects: Array<Types.EventPassOrder_Insert_Input> | Types.EventPassOrder_Insert_Input;
}>;


export type UpsertEventPassOrdersMutation = { __typename?: 'mutation_root', insert_eventPassOrder?: { __typename?: 'eventPassOrder_mutation_response', returning: Array<{ __typename?: 'eventPassOrder', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId: string, accountId: any, created_at: any }> } | null };

export type GetAccountEventPassOrderForEventPassesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetAccountEventPassOrderForEventPassesQuery = { __typename?: 'query_root', eventPassOrder: Array<{ __typename?: 'eventPassOrder', eventPassId: string, quantity: number, status: Types.OrderStatus_Enum, created_at: any }> };

export type DeleteEventPassPendingOrdersMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
}>;


export type DeleteEventPassPendingOrdersMutation = { __typename?: 'mutation_root', delete_eventPassPendingOrder?: { __typename?: 'eventPassPendingOrder_mutation_response', affected_rows: number } | null };

export type GetEventPassPendingOrdersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetEventPassPendingOrdersQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', created_at: any, id: any, eventPassId: string, account?: { __typename?: 'account', email?: string | null, address: string } | null, eventPassPricing?: { __typename?: 'eventPassPricing', timeBeforeDelete: number } | null }> };

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

export type GetNftByCollectionAndTokenIdsQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String'];
  chainId: Types.Scalars['String'];
  tokenIds: Array<Types.Scalars['bigint']> | Types.Scalars['bigint'];
}>;


export type GetNftByCollectionAndTokenIdsQuery = { __typename?: 'query_root', nftWithMetadata: Array<{ __typename?: 'nftWithMetadata', tokenId: any, eventId: string, eventPassId: string, organizerId: string }> };

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

export type GetEventNftCollectionByContractAddressWithMinimalEventPassesQueryVariables = Types.Exact<{
  contractAddress: Types.Scalars['String'];
  stage: Types.Stage;
}>;


export type GetEventWithFromOrganizerIdQuery = { __typename?: 'query_root', organizer?: { __typename?: 'Organizer', events: Array<{ __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string } }> } | null };

export type GetEventNftCollectionByContractAddressWithMinimalEventPassesQuery = { __typename?: 'query_root', eventNftCollection_by_pk?: { __typename?: 'eventNftCollection', contractAddress: string, chainId: string, activityWebhookId: string, event?: { __typename?: 'Event', id: string, eventPasses: Array<{ __typename?: 'EventPass', id: string }>, organizer?: { __typename?: 'Organizer', id: string } | null } | null } | null };

export type GetEventPassesQueryVariables = Types.Exact<{
  eventSlug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassesQuery = { __typename?: 'query_root', eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, eventPassPricing?: { __typename?: 'eventPassPricing', maxAmount: number, maxAmountPerUser?: number | null, priceAmount: number, priceCurrency: Types.Currency_Enum } | null, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } }>, eventPassOrderSums?: { __typename?: 'eventPassOrderSums', totalReserved: number } | null }> };

export type UpdateEventPassNftFromNftTransferMutationVariables = Types.Exact<{
  updates: Array<Types.EventPassNft_Updates> | Types.EventPassNft_Updates;
}>;


export type UpdateEventPassNftFromNftTransferMutation = { __typename?: 'mutation_root', update_eventPassNft_many?: Array<{ __typename?: 'eventPassNft_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'eventPassNft', id: any, isRevealed: boolean, currentOwnerAddress: string, eventId: string, eventPassId: string, organizerId: string, tokenId: any, lastNftTransfer?: { __typename?: 'nftTransfer', fromAddress: string } | null }> } | null> | null };

export type SetEventPassNftRevealedMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type SetEventPassNftRevealedMutation = { __typename?: 'mutation_root', update_eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any } | null };

export type GetEventPassNftByContractsAndTokenIdsQueryVariables = Types.Exact<{
  contractAddresses: Array<Types.Scalars['String']> | Types.Scalars['String'];
  chainId: Types.Scalars['String'];
  tokenIds: Array<Types.Scalars['bigint']> | Types.Scalars['bigint'];
}>;


export type GetEventPassNftByContractsAndTokenIdsQuery = { __typename?: 'query_root', eventPassNft: Array<{ __typename?: 'eventPassNft', tokenId: any, eventId: string, eventPassId: string, organizerId: string }> };

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

export type EventPassFieldsFragment = { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null } | null };

export type EventPassNftFieldsFragment = { __typename?: 'eventPassNft', id: any, tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress: string };

export type GetEventPassNftByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventPassNftByIdQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress: string, eventPass?: { __typename?: 'EventPass', name: string, description: string, nftImage: { __typename?: 'Asset', url: string }, passOptions: Array<{ __typename?: 'PassOption', name: string, description?: string | null, eventDateLocation: { __typename?: 'EventDateLocation', dateStart: any, dateEnd: any, locationAddress: { __typename?: 'LocationAddress', city: string, country: string, placeId?: string | null, postalCode: string, state?: string | null, street?: string | null, venue?: string | null, coordinates: { __typename?: 'Location', latitude: number, longitude: number } } } }>, eventPassPricing?: { __typename?: 'eventPassPricing', priceAmount: number, priceCurrency: Types.Currency_Enum } | null, event?: { __typename?: 'Event', slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null } | null } | null } | null };

export type GetEventPassNftByIdMinimalQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type GetEventPassNftByIdMinimalQuery = { __typename?: 'query_root', eventPassNft_by_pk?: { __typename?: 'eventPassNft', id: any, tokenId: any, eventId: string, eventPassId: string, organizerId: string, isRevealed: boolean, currentOwnerAddress: string } | null };
