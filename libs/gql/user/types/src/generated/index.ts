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

export type GetEventPassPendingOrderForEventPassesQueryVariables = Types.Exact<{
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetEventPassPendingOrderForEventPassesQuery = { __typename?: 'query_root', eventPassPendingOrder: Array<{ __typename?: 'eventPassPendingOrder', id: any, eventPassId: string, quantity: number, created_at: any }> };

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
