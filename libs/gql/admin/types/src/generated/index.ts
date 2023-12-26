import * as Types from '@gql/shared/types';

export type AccountFieldsFragment = { __typename?: 'account', id: any, address: string, scwAddress?: string | null, email?: string | null, phone?: string | null };

export type UpdateAccountMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
  account: Types.Account_Set_Input;
}>;


export type UpdateAccountMutation = { __typename?: 'mutation_root', update_account_by_pk?: { __typename?: 'account', id: any, address: string, scwAddress?: string | null, email?: string | null, phone?: string | null } | null };

export type CreateAccountMutationVariables = Types.Exact<{
  account: Types.Account_Insert_Input;
}>;


export type CreateAccountMutation = { __typename?: 'mutation_root', insert_account_one?: { __typename?: 'account', id: any, address: string, scwAddress?: string | null, email?: string | null, phone?: string | null } | null };

export type GetAccountQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
}>;


export type GetAccountQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, scwAddress?: string | null, email?: string | null, phone?: string | null, kyc?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null, roles: Array<{ __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string }> }> };

export type GetAccountByEmailQueryVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type GetAccountByEmailQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, scwAddress?: string | null, email?: string | null, phone?: string | null, kyc?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null }> };

export type GetAccountByAddressQueryVariables = Types.Exact<{
  address: Types.Scalars['String'];
}>;


export type GetAccountByAddressQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', id: any, address: string, scwAddress?: string | null, email?: string | null, phone?: string | null }> };

export type GetAccountByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type GetAccountByIdQuery = { __typename?: 'query_root', account: Array<{ __typename?: 'account', address: string }> };

export type UpdateOrderStatusMutationVariables = Types.Exact<{
  updates: Array<Types.Order_Updates> | Types.Order_Updates;
}>;


export type UpdateOrderStatusMutation = { __typename?: 'mutation_root', update_order_many?: Array<{ __typename?: 'order_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'order', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId?: string | null, packId?: string | null, accountId: any, created_at: any }> } | null> | null };

export type SetOrderStripeCheckoutSessionIdMutationVariables = Types.Exact<{
  updates: Array<Types.Order_Updates> | Types.Order_Updates;
}>;


export type SetOrderStripeCheckoutSessionIdMutation = { __typename?: 'mutation_root', update_order_many?: Array<{ __typename?: 'order_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'order', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId?: string | null, packId?: string | null, accountId: any, created_at: any, stripeCheckoutSessionId?: string | null }> } | null> | null };

export type MovePendingOrdersToConfirmedMutationVariables = Types.Exact<{
  pendingOrdersIds: Array<Types.Scalars['uuid']> | Types.Scalars['uuid'];
  objects: Array<Types.Order_Insert_Input> | Types.Order_Insert_Input;
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type MovePendingOrdersToConfirmedMutation = { __typename?: 'mutation_root', delete_pendingOrder?: { __typename?: 'pendingOrder_mutation_response', affected_rows: number } | null, insert_order?: { __typename?: 'order_mutation_response', returning: Array<{ __typename?: 'order', id: any, quantity: number, status: Types.OrderStatus_Enum, eventPassId?: string | null, packId?: string | null, accountId: any, created_at: any, passPricing?: { __typename?: 'passPricing', amount: number, currency: Types.Currency_Enum } | null, eventPass?: { __typename?: 'EventPass', id: string, name: string, nftImage: { __typename?: 'Asset', url: string }, event?: { __typename?: 'Event', slug: string, organizer?: { __typename?: 'Organizer', slug: string } | null } | null } | null }> } | null };

export type GetAccountOrderForEventPassesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  eventPassIds?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetAccountOrderForEventPassesQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, created_at: any }> };

export type GetOrderFromIdQueryVariables = Types.Exact<{
  id: Types.Scalars['uuid'];
}>;


export type GetOrderFromIdQuery = { __typename?: 'query_root', order_by_pk?: { __typename?: 'order', id: any, eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null, passPricing?: { __typename?: 'passPricing', amount: number } | null } | null };

export type GetOrdersFromStripeCheckoutSessionQueryVariables = Types.Exact<{
  stripeCheckoutSessionId: Types.Scalars['String'];
}>;


export type GetOrdersFromStripeCheckoutSessionQuery = { __typename?: 'query_root', order: Array<{ __typename?: 'order', id: any, eventPassId?: string | null, packId?: string | null, quantity: number, status: Types.OrderStatus_Enum, eventPassNftContract?: { __typename?: 'eventPassNftContract', contractAddress: string } | null, account?: { __typename?: 'account', address: string } | null, passPricing?: { __typename?: 'passPricing', amount: number } | null }> };

export type KycFieldsFragment = { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null };

export type CreateKycMutationVariables = Types.Exact<{
  kyc: Types.Kyc_Insert_Input;
}>;


export type CreateKycMutation = { __typename?: 'mutation_root', insert_kyc_one?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null };

export type UpdateKycMutationVariables = Types.Exact<{
  externalUserId: Types.Scalars['uuid'];
  kyc: Types.Kyc_Set_Input;
}>;


export type UpdateKycMutation = { __typename?: 'mutation_root', update_kyc_by_pk?: { __typename?: 'kyc', applicantId?: string | null, reviewStatus?: Types.KycStatus_Enum | null, levelName?: Types.KycLevelName_Enum | null } | null };

export type DeleteKycMutationVariables = Types.Exact<{
  externalUserId: Types.Scalars['uuid'];
}>;


export type DeleteKycMutation = { __typename?: 'mutation_root', delete_kyc_by_pk?: { __typename?: 'kyc', externalUserId: any } | null };

export type RoleAssignmentFieldsFragment = { __typename?: 'roleAssignment', role: Types.Roles_Enum, organizerId: string, eventId: string };

export type CreateRoleAssignmentMutationVariables = Types.Exact<{
  input: Types.RoleAssignment_Insert_Input;
}>;


export type CreateRoleAssignmentMutation = { __typename?: 'mutation_root', insert_roleAssignment_one?: { __typename?: 'roleAssignment', role: Types.Roles_Enum } | null };

export type GetRoleMinimalQueryVariables = Types.Exact<{
  accountId: Types.Scalars['uuid'];
  role: Types.Roles_Enum;
  organizerId: Types.Scalars['String'];
  eventId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetRoleMinimalQuery = { __typename?: 'query_root', roleAssignment: Array<{ __typename?: 'roleAssignment', id: any }> };
