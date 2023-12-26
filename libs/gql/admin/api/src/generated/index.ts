import * as Types from '@gql/admin/types';

import { fetchData } from "@next/hasura/api";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  address
  scwAddress
  email
  phone
}
    `;
export const KycFieldsFragmentDoc = `
    fragment KycFields on kyc {
  applicantId
  reviewStatus
  levelName
}
    `;
export const RoleAssignmentFieldsFragmentDoc = `
    fragment RoleAssignmentFields on roleAssignment {
  role
  organizerId
  eventId
}
    `;
 const UpdateAccountDocument = `
    mutation UpdateAccount($id: uuid!, $account: account_set_input!) {
  update_account_by_pk(_set: $account, pk_columns: {id: $id}) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
 const CreateAccountDocument = `
    mutation CreateAccount($account: account_insert_input!) {
  insert_account_one(object: $account) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
 const GetAccountDocument = `
    query GetAccount($address: String!) {
  account(where: {address: {_eq: $address}}) {
    ...AccountFields
    kyc {
      ...KycFields
    }
    roles {
      ...RoleAssignmentFields
    }
  }
}
    ${AccountFieldsFragmentDoc}
${KycFieldsFragmentDoc}
${RoleAssignmentFieldsFragmentDoc}`;
 const GetAccountByEmailDocument = `
    query GetAccountByEmail($email: String!) {
  account(where: {email: {_eq: $email}}) {
    ...AccountFields
    kyc {
      ...KycFields
    }
  }
}
    ${AccountFieldsFragmentDoc}
${KycFieldsFragmentDoc}`;
 const GetAccountByAddressDocument = `
    query GetAccountByAddress($address: String!) {
  account(where: {address: {_eq: $address}}) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
 const GetAccountByIdDocument = `
    query GetAccountById($id: uuid!) {
  account(where: {id: {_eq: $id}}) {
    address
  }
}
    `;
 const UpdateOrderStatusDocument = `
    mutation UpdateOrderStatus($updates: [order_updates!]!) {
  update_order_many(updates: $updates) {
    affected_rows
    returning {
      id
      quantity
      status
      eventPassId
      packId
      accountId
      created_at
    }
  }
}
    `;
 const SetOrderStripeCheckoutSessionIdDocument = `
    mutation SetOrderStripeCheckoutSessionId($updates: [order_updates!]!) {
  update_order_many(updates: $updates) {
    affected_rows
    returning {
      id
      quantity
      status
      eventPassId
      packId
      accountId
      created_at
      stripeCheckoutSessionId
    }
  }
}
    `;
 const MovePendingOrdersToConfirmedDocument = `
    mutation MovePendingOrdersToConfirmed($pendingOrdersIds: [uuid!]!, $objects: [order_insert_input!]!, $locale: Locale!, $stage: Stage!) {
  delete_pendingOrder(where: {id: {_in: $pendingOrdersIds}}) {
    affected_rows
  }
  insert_order(objects: $objects) {
    returning {
      id
      quantity
      status
      eventPassId
      packId
      accountId
      created_at
      passPricing {
        amount
        currency
      }
      eventPass(locales: [$locale, en], stage: $stage) {
        id
        name
        nftImage {
          url
        }
        event {
          slug
          organizer {
            slug
          }
        }
      }
    }
  }
}
    `;
 const GetAccountOrderForEventPassesDocument = `
    query GetAccountOrderForEventPasses($accountId: uuid!, $eventPassIds: [String!]) {
  order(where: {accountId: {_eq: $accountId}, eventPassId: {_in: $eventPassIds}}) {
    eventPassId
    packId
    quantity
    status
    created_at
  }
}
    `;
 const GetOrderFromIdDocument = `
    query GetOrderFromId($id: uuid!) {
  order_by_pk(id: $id) {
    id
    eventPassId
    packId
    quantity
    status
    eventPassNftContract {
      contractAddress
    }
    account {
      address
    }
    passPricing {
      amount
    }
  }
}
    `;
 const GetOrdersFromStripeCheckoutSessionDocument = `
    query GetOrdersFromStripeCheckoutSession($stripeCheckoutSessionId: String!) {
  order(where: {stripeCheckoutSessionId: {_eq: $stripeCheckoutSessionId}}) {
    id
    eventPassId
    packId
    quantity
    status
    eventPassNftContract {
      contractAddress
    }
    account {
      address
    }
    passPricing {
      amount
    }
  }
}
    `;
 const DeletePendingOrdersDocument = `
    mutation DeletePendingOrders($ids: [uuid!]!) {
  delete_pendingOrder(where: {id: {_in: $ids}}) {
    affected_rows
  }
}
    `;
 const GetPendingOrdersDocument = `
    query GetPendingOrders {
  pendingOrder {
    created_at
    id
    eventPassId
    packId
    account {
      email
      address
    }
    passAmount {
      timeBeforeDelete
    }
  }
}
    `;
 const CreateKycDocument = `
    mutation CreateKyc($kyc: kyc_insert_input!) {
  insert_kyc_one(object: $kyc) {
    ...KycFields
  }
}
    ${KycFieldsFragmentDoc}`;
 const UpdateKycDocument = `
    mutation UpdateKyc($externalUserId: uuid!, $kyc: kyc_set_input!) {
  update_kyc_by_pk(pk_columns: {externalUserId: $externalUserId}, _set: $kyc) {
    ...KycFields
  }
}
    ${KycFieldsFragmentDoc}`;
 const DeleteKycDocument = `
    mutation DeleteKyc($externalUserId: uuid!) {
  delete_kyc_by_pk(externalUserId: $externalUserId) {
    externalUserId
  }
}
    `;
 const CreateRoleAssignmentDocument = `
    mutation CreateRoleAssignment($input: roleAssignment_insert_input!) {
  insert_roleAssignment_one(object: $input) {
    role
  }
}
    `;
 const GetRoleMinimalDocument = `
    query GetRoleMinimal($accountId: uuid!, $role: roles_enum!, $organizerId: String!, $eventId: String) {
  roleAssignment(
    where: {accountId: {_eq: $accountId}, role: {_eq: $role}, organizerId: {_eq: $organizerId}, eventId: {_eq: $eventId}}
  ) {
    id
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: string, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    UpdateAccount(variables: Types.UpdateAccountMutationVariables, options?: C): Promise<Types.UpdateAccountMutation> {
      return requester<Types.UpdateAccountMutation, Types.UpdateAccountMutationVariables>(UpdateAccountDocument, variables, options) as Promise<Types.UpdateAccountMutation>;
    },
    CreateAccount(variables: Types.CreateAccountMutationVariables, options?: C): Promise<Types.CreateAccountMutation> {
      return requester<Types.CreateAccountMutation, Types.CreateAccountMutationVariables>(CreateAccountDocument, variables, options) as Promise<Types.CreateAccountMutation>;
    },
    GetAccount(variables: Types.GetAccountQueryVariables, options?: C): Promise<Types.GetAccountQuery> {
      return requester<Types.GetAccountQuery, Types.GetAccountQueryVariables>(GetAccountDocument, variables, options) as Promise<Types.GetAccountQuery>;
    },
    GetAccountByEmail(variables: Types.GetAccountByEmailQueryVariables, options?: C): Promise<Types.GetAccountByEmailQuery> {
      return requester<Types.GetAccountByEmailQuery, Types.GetAccountByEmailQueryVariables>(GetAccountByEmailDocument, variables, options) as Promise<Types.GetAccountByEmailQuery>;
    },
    GetAccountByAddress(variables: Types.GetAccountByAddressQueryVariables, options?: C): Promise<Types.GetAccountByAddressQuery> {
      return requester<Types.GetAccountByAddressQuery, Types.GetAccountByAddressQueryVariables>(GetAccountByAddressDocument, variables, options) as Promise<Types.GetAccountByAddressQuery>;
    },
    GetAccountById(variables: Types.GetAccountByIdQueryVariables, options?: C): Promise<Types.GetAccountByIdQuery> {
      return requester<Types.GetAccountByIdQuery, Types.GetAccountByIdQueryVariables>(GetAccountByIdDocument, variables, options) as Promise<Types.GetAccountByIdQuery>;
    },
    UpdateOrderStatus(variables: Types.UpdateOrderStatusMutationVariables, options?: C): Promise<Types.UpdateOrderStatusMutation> {
      return requester<Types.UpdateOrderStatusMutation, Types.UpdateOrderStatusMutationVariables>(UpdateOrderStatusDocument, variables, options) as Promise<Types.UpdateOrderStatusMutation>;
    },
    SetOrderStripeCheckoutSessionId(variables: Types.SetOrderStripeCheckoutSessionIdMutationVariables, options?: C): Promise<Types.SetOrderStripeCheckoutSessionIdMutation> {
      return requester<Types.SetOrderStripeCheckoutSessionIdMutation, Types.SetOrderStripeCheckoutSessionIdMutationVariables>(SetOrderStripeCheckoutSessionIdDocument, variables, options) as Promise<Types.SetOrderStripeCheckoutSessionIdMutation>;
    },
    MovePendingOrdersToConfirmed(variables: Types.MovePendingOrdersToConfirmedMutationVariables, options?: C): Promise<Types.MovePendingOrdersToConfirmedMutation> {
      return requester<Types.MovePendingOrdersToConfirmedMutation, Types.MovePendingOrdersToConfirmedMutationVariables>(MovePendingOrdersToConfirmedDocument, variables, options) as Promise<Types.MovePendingOrdersToConfirmedMutation>;
    },
    GetAccountOrderForEventPasses(variables: Types.GetAccountOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetAccountOrderForEventPassesQuery> {
      return requester<Types.GetAccountOrderForEventPassesQuery, Types.GetAccountOrderForEventPassesQueryVariables>(GetAccountOrderForEventPassesDocument, variables, options) as Promise<Types.GetAccountOrderForEventPassesQuery>;
    },
    GetOrderFromId(variables: Types.GetOrderFromIdQueryVariables, options?: C): Promise<Types.GetOrderFromIdQuery> {
      return requester<Types.GetOrderFromIdQuery, Types.GetOrderFromIdQueryVariables>(GetOrderFromIdDocument, variables, options) as Promise<Types.GetOrderFromIdQuery>;
    },
    GetOrdersFromStripeCheckoutSession(variables: Types.GetOrdersFromStripeCheckoutSessionQueryVariables, options?: C): Promise<Types.GetOrdersFromStripeCheckoutSessionQuery> {
      return requester<Types.GetOrdersFromStripeCheckoutSessionQuery, Types.GetOrdersFromStripeCheckoutSessionQueryVariables>(GetOrdersFromStripeCheckoutSessionDocument, variables, options) as Promise<Types.GetOrdersFromStripeCheckoutSessionQuery>;
    },
    DeletePendingOrders(variables: Types.DeletePendingOrdersMutationVariables, options?: C): Promise<Types.DeletePendingOrdersMutation> {
      return requester<Types.DeletePendingOrdersMutation, Types.DeletePendingOrdersMutationVariables>(DeletePendingOrdersDocument, variables, options) as Promise<Types.DeletePendingOrdersMutation>;
    },
    GetPendingOrders(variables?: Types.GetPendingOrdersQueryVariables, options?: C): Promise<Types.GetPendingOrdersQuery> {
      return requester<Types.GetPendingOrdersQuery, Types.GetPendingOrdersQueryVariables>(GetPendingOrdersDocument, variables, options) as Promise<Types.GetPendingOrdersQuery>;
    },
    CreateKyc(variables: Types.CreateKycMutationVariables, options?: C): Promise<Types.CreateKycMutation> {
      return requester<Types.CreateKycMutation, Types.CreateKycMutationVariables>(CreateKycDocument, variables, options) as Promise<Types.CreateKycMutation>;
    },
    UpdateKyc(variables: Types.UpdateKycMutationVariables, options?: C): Promise<Types.UpdateKycMutation> {
      return requester<Types.UpdateKycMutation, Types.UpdateKycMutationVariables>(UpdateKycDocument, variables, options) as Promise<Types.UpdateKycMutation>;
    },
    DeleteKyc(variables: Types.DeleteKycMutationVariables, options?: C): Promise<Types.DeleteKycMutation> {
      return requester<Types.DeleteKycMutation, Types.DeleteKycMutationVariables>(DeleteKycDocument, variables, options) as Promise<Types.DeleteKycMutation>;
    },
    CreateRoleAssignment(variables: Types.CreateRoleAssignmentMutationVariables, options?: C): Promise<Types.CreateRoleAssignmentMutation> {
      return requester<Types.CreateRoleAssignmentMutation, Types.CreateRoleAssignmentMutationVariables>(CreateRoleAssignmentDocument, variables, options) as Promise<Types.CreateRoleAssignmentMutation>;
    },
    GetRoleMinimal(variables: Types.GetRoleMinimalQueryVariables, options?: C): Promise<Types.GetRoleMinimalQuery> {
      return requester<Types.GetRoleMinimalQuery, Types.GetRoleMinimalQueryVariables>(GetRoleMinimalDocument, variables, options) as Promise<Types.GetRoleMinimalQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const adminSdk = getSdk(fetchData({admin:true}));