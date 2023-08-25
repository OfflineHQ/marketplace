import * as Types from '@gql/admin/types';

import { fetchData } from "@next/hasura/api";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  address
  email
  emailVerified
}
    `;
export const NftTransferFieldsFragmentDoc = `
    fragment NftTransferFields on nftTransfer {
  fromAddress
  toAddress
  chainId
  blockNumber
  eventId
  organizerId
  eventPassId
  tokenId
  created_at
  id
  contractAddress
}
    `;
export const EventListFieldsFragmentDoc = `
    fragment EventListFields on Event {
  id
  slug
  title
  heroImage {
    url
  }
}
    `;
export const OrganizerFieldsFragmentDoc = `
    fragment OrganizerFields on Organizer {
  id
  slug
  name
  description {
    json
    references {
      ... on Asset {
        __typename
        id
        url
        mimeType
      }
    }
  }
  image {
    url
  }
}
    `;
export const EventDateLocationsFieldsFragmentDoc = `
    fragment EventDateLocationsFields on EventDateLocation {
  locationAddress {
    coordinates {
      latitude
      longitude
    }
    city
    country
    placeId
    postalCode
    state
    street
    venue
  }
  dateStart
  dateEnd
}
    `;
export const EventPassOwnedFieldsFragmentDoc = `
    fragment EventPassOwnedFields on eventPassOwned {
  id
  eventPassId
  address
  isRevealed
  transactionHash
  timeStamp
  chainId
  contractAddress
  tokenId
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
  }
}
    ${AccountFieldsFragmentDoc}`;
 const GetAccountByEmailDocument = `
    query GetAccountByEmail($email: String!) {
  account(where: {email: {_eq: $email}}) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
 const GetAccountEventPassOrderForEventPassesDocument = `
    query GetAccountEventPassOrderForEventPasses($accountId: uuid!, $eventPassIds: [String!]) {
  eventPassOrder(
    where: {accountId: {_eq: $accountId}, eventPassId: {_in: $eventPassIds}}
  ) {
    eventPassId
    quantity
    status
    created_at
  }
}
    `;
 const UpsertEventPassOrdersDocument = `
    mutation UpsertEventPassOrders($objects: [eventPassOrder_insert_input!]!) {
  insert_eventPassOrder(
    objects: $objects
    on_conflict: {constraint: eventPassOrder_pkey, update_columns: [quantity]}
  ) {
    returning {
      id
      quantity
      status
      eventPassId
      accountId
      created_at
    }
  }
}
    `;
 const GetEventPassPendingOrdersDocument = `
    query GetEventPassPendingOrders {
  eventPassPendingOrder {
    created_at
    id
    eventPassId
    account {
      email
      address
    }
    eventPassPricing {
      timeBeforeDelete
    }
  }
}
    `;
 const DeleteEventPassPendingOrdersDocument = `
    mutation DeleteEventPassPendingOrders($ids: [uuid!]!) {
  delete_eventPassPendingOrder(where: {id: {_in: $ids}}) {
    affected_rows
  }
}
    `;
 const GetNftTransferByTxHashDocument = `
    query GetNftTransferByTxHash($txHash: String!, $chainId: String!) {
  nftTransfer(where: {transactionHash: {_eq: $txHash}, chainId: {_eq: $chainId}}) {
    ...NftTransferFields
  }
}
    ${NftTransferFieldsFragmentDoc}`;
 const GetNftTransferByTokenIdAndCollectionDocument = `
    query GetNftTransferByTokenIdAndCollection($tokenId: bigint!, $contractAddress: String!, $chainId: String!) {
  nftTransfer(
    where: {tokenId: {_eq: $tokenId}, contractAddress: {_eq: $contractAddress}, chainId: {_eq: $chainId}}
    order_by: {blockNumber: desc}
  ) {
    ...NftTransferFields
  }
}
    ${NftTransferFieldsFragmentDoc}`;
 const GetNftByCollectionAndTokenIdsDocument = `
    query GetNftByCollectionAndTokenIds($contractAddress: String!, $chainId: String!, $tokenIds: [bigint!]!) @cached {
  nftWithMetadata(
    where: {contractAddress: {_eq: $contractAddress}, chainId: {_eq: $chainId}, tokenId: {_in: $tokenIds}}
  ) {
    tokenId
    eventId
    eventPassId
    organizerId
  }
}
    `;
 const GetEventDocument = `
    query GetEvent($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  event(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
    ...EventListFields
    description {
      json
      references {
        ... on Asset {
          __typename
          id
          url
          mimeType
        }
      }
    }
    organizer {
      id
      slug
      name
      image {
        url
      }
    }
    eventDateLocations {
      ...EventDateLocationsFields
    }
  }
}
    ${EventListFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventWithPassesDocument = `
    query GetEventWithPasses($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  event(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
    id
    slug
    title
    heroImage {
      url
    }
    organizer {
      id
      slug
      name
      image {
        url
      }
    }
    eventDateLocations {
      ...EventDateLocationsFields
    }
    eventPasses {
      id
      name
      description
      eventPassPricing {
        priceAmount
        priceCurrency
        maxAmount
        maxAmountPerUser
      }
    }
  }
}
    ${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventWithFromOrganizerIdDocument = `
    query GetEventWithFromOrganizerId($id: ID!, $locale: Locale!, $stage: Stage!) @cached {
  organizer(where: {id: $id}, locales: [$locale, en], stage: $stage) {
    events {
      slug
      title
      id
      heroImage {
        url
      }
      eventNftCollection {
        contractAddress
      }
    }
  }
}
    `;


 const GetEventNftCollectionByContractAddressWithMinimalEventPassesDocument = `
    query GetEventNftCollectionByContractAddressWithMinimalEventPasses($contractAddress: String!, $stage: Stage!) {
  eventNftCollection_by_pk(contractAddress: $contractAddress) {
    contractAddress
    chainId
    activityWebhookId
    event(where: {}, locales: [en], stage: $stage) {
      id
      eventPasses {
        id
      }
      organizer {
        id
      }
    }
  }
}
    `;
 const GetEventPassesDocument = `
    query GetEventPasses($eventSlug: String!, $locale: Locale!, $stage: Stage!) {
  eventPasses(
    where: {event: {slug: $eventSlug}}
    locales: [$locale, en]
    stage: $stage
  ) {
    id
    name
    description
    eventPassPricing {
      maxAmount
      maxAmountPerUser
      priceAmount
      priceCurrency
    }
    passOptions {
      name
      description
      eventDateLocation {
        ...EventDateLocationsFields
      }
    }
    eventPassOrderSums {
      totalReserved
    }
  }
}
    ${EventDateLocationsFieldsFragmentDoc}`;
 const CreateEventPassPricingDocument = `
    mutation CreateEventPassPricing($eventPassPricing: eventPassPricing_insert_input!) {
  insert_eventPassPricing_one(object: $eventPassPricing) {
    id
    eventPassId
    priceAmount
    priceCurrency
    maxAmount
    maxAmountPerUser
  }
}
    `;
 const UpdateEventPassPricingDocument = `
    mutation UpdateEventPassPricing($id: uuid!, $eventPassPricing: eventPassPricing_set_input!) {
  update_eventPassPricing_by_pk(pk_columns: {id: $id}, _set: $eventPassPricing) {
    id
    eventPassId
    priceAmount
    priceCurrency
    maxAmount
    maxAmountPerUser
  }
}
    `;
 const GetOrganizerDocument = `
    query GetOrganizer($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  organizer(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
    ...OrganizerFields
  }
}
    ${OrganizerFieldsFragmentDoc}`;
 const SetEventPassOwnedRevealedDocument = `
    mutation SetEventPassOwnedRevealed($id: uuid!) {
  update_eventPassOwned_by_pk(pk_columns: {id: $id}, _set: {isRevealed: true}) {
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
    GetAccountEventPassOrderForEventPasses(variables: Types.GetAccountEventPassOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetAccountEventPassOrderForEventPassesQuery> {
      return requester<Types.GetAccountEventPassOrderForEventPassesQuery, Types.GetAccountEventPassOrderForEventPassesQueryVariables>(GetAccountEventPassOrderForEventPassesDocument, variables, options) as Promise<Types.GetAccountEventPassOrderForEventPassesQuery>;
    },
    UpsertEventPassOrders(variables: Types.UpsertEventPassOrdersMutationVariables, options?: C): Promise<Types.UpsertEventPassOrdersMutation> {
      return requester<Types.UpsertEventPassOrdersMutation, Types.UpsertEventPassOrdersMutationVariables>(UpsertEventPassOrdersDocument, variables, options) as Promise<Types.UpsertEventPassOrdersMutation>;
    },
    GetEventPassPendingOrders(variables?: Types.GetEventPassPendingOrdersQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrdersQuery> {
      return requester<Types.GetEventPassPendingOrdersQuery, Types.GetEventPassPendingOrdersQueryVariables>(GetEventPassPendingOrdersDocument, variables, options) as Promise<Types.GetEventPassPendingOrdersQuery>;
    },
    DeleteEventPassPendingOrders(variables: Types.DeleteEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrdersMutation> {
      return requester<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrdersMutation>;
    },
    GetNftTransferByTxHash(variables: Types.GetNftTransferByTxHashQueryVariables, options?: C): Promise<Types.GetNftTransferByTxHashQuery> {
      return requester<Types.GetNftTransferByTxHashQuery, Types.GetNftTransferByTxHashQueryVariables>(GetNftTransferByTxHashDocument, variables, options) as Promise<Types.GetNftTransferByTxHashQuery>;
    },
    GetNftTransferByTokenIdAndCollection(variables: Types.GetNftTransferByTokenIdAndCollectionQueryVariables, options?: C): Promise<Types.GetNftTransferByTokenIdAndCollectionQuery> {
      return requester<Types.GetNftTransferByTokenIdAndCollectionQuery, Types.GetNftTransferByTokenIdAndCollectionQueryVariables>(GetNftTransferByTokenIdAndCollectionDocument, variables, options) as Promise<Types.GetNftTransferByTokenIdAndCollectionQuery>;
    },
    GetNftByCollectionAndTokenIds(variables: Types.GetNftByCollectionAndTokenIdsQueryVariables, options?: C): Promise<Types.GetNftByCollectionAndTokenIdsQuery> {
      return requester<Types.GetNftByCollectionAndTokenIdsQuery, Types.GetNftByCollectionAndTokenIdsQueryVariables>(GetNftByCollectionAndTokenIdsDocument, variables, options) as Promise<Types.GetNftByCollectionAndTokenIdsQuery>;
    },
    GetEvent(variables: Types.GetEventQueryVariables, options?: C): Promise<Types.GetEventQuery> {
      return requester<Types.GetEventQuery, Types.GetEventQueryVariables>(GetEventDocument, variables, options) as Promise<Types.GetEventQuery>;
    },
    GetEventWithPasses(variables: Types.GetEventWithPassesQueryVariables, options?: C): Promise<Types.GetEventWithPassesQuery> {
      return requester<Types.GetEventWithPassesQuery, Types.GetEventWithPassesQueryVariables>(GetEventWithPassesDocument, variables, options) as Promise<Types.GetEventWithPassesQuery>;
    },
    GetEventWithFromOrganizerId(variables: Types.GetEventWithFromOrganizerIdQueryVariables, options?: C): Promise<Types.GetEventWithFromOrganizerIdQuery> {
      return requester<Types.GetEventWithFromOrganizerIdQuery, Types.GetEventWithFromOrganizerIdQueryVariables>(GetEventWithFromOrganizerIdDocument, variables, options) as Promise<Types.GetEventWithFromOrganizerIdQuery>;
    },
      GetEventNftCollectionByContractAddressWithMinimalEventPasses(variables: Types.GetEventNftCollectionByContractAddressWithMinimalEventPassesQueryVariables, options?: C): Promise<Types.GetEventNftCollectionByContractAddressWithMinimalEventPassesQuery> {
      return requester<Types.GetEventNftCollectionByContractAddressWithMinimalEventPassesQuery, Types.GetEventNftCollectionByContractAddressWithMinimalEventPassesQueryVariables>(GetEventNftCollectionByContractAddressWithMinimalEventPassesDocument, variables, options) as Promise<Types.GetEventNftCollectionByContractAddressWithMinimalEventPassesQuery>;
    },
    GetEventPasses(variables: Types.GetEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassesQuery> {
      return requester<Types.GetEventPassesQuery, Types.GetEventPassesQueryVariables>(GetEventPassesDocument, variables, options) as Promise<Types.GetEventPassesQuery>;
    },
    CreateEventPassPricing(variables: Types.CreateEventPassPricingMutationVariables, options?: C): Promise<Types.CreateEventPassPricingMutation> {
      return requester<Types.CreateEventPassPricingMutation, Types.CreateEventPassPricingMutationVariables>(CreateEventPassPricingDocument, variables, options) as Promise<Types.CreateEventPassPricingMutation>;
    },
    UpdateEventPassPricing(variables: Types.UpdateEventPassPricingMutationVariables, options?: C): Promise<Types.UpdateEventPassPricingMutation> {
      return requester<Types.UpdateEventPassPricingMutation, Types.UpdateEventPassPricingMutationVariables>(UpdateEventPassPricingDocument, variables, options) as Promise<Types.UpdateEventPassPricingMutation>;
    },
    GetOrganizer(variables: Types.GetOrganizerQueryVariables, options?: C): Promise<Types.GetOrganizerQuery> {
      return requester<Types.GetOrganizerQuery, Types.GetOrganizerQueryVariables>(GetOrganizerDocument, variables, options) as Promise<Types.GetOrganizerQuery>;
    },
    SetEventPassOwnedRevealed(variables: Types.SetEventPassOwnedRevealedMutationVariables, options?: C): Promise<Types.SetEventPassOwnedRevealedMutation> {
      return requester<Types.SetEventPassOwnedRevealedMutation, Types.SetEventPassOwnedRevealedMutationVariables>(SetEventPassOwnedRevealedDocument, variables, options) as Promise<Types.SetEventPassOwnedRevealedMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const adminSdk = getSdk(fetchData({admin:true}));