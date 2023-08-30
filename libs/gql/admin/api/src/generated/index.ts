import * as Types from '@gql/admin/types';

import { fetchData } from "@next/hasura/api";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  address
  email
  emailVerified
  organizerId
}
    `;
export const NftTransferFieldsFragmentDoc = `
    fragment NftTransferFields on nftTransfer {
  id
  contractAddress
  fromAddress
  toAddress
  transactionHash
  chainId
  blockNumber
  eventId
  organizerId
  eventPassId
  tokenId
  created_at
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
export const EventPassFieldsFragmentDoc = `
    fragment EventPassFields on EventPass {
  name
  nftImage {
    url
  }
  description
  passOptions {
    name
    description
    eventDateLocation {
      ...EventDateLocationsFields
    }
  }
  eventPassPricing {
    priceAmount
    priceCurrency
  }
  event {
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
  }
}
    ${EventDateLocationsFieldsFragmentDoc}`;
export const EventPassNftFieldsFragmentDoc = `
    fragment EventPassNftFields on eventPassNft {
  id
  tokenId
  eventId
  eventPassId
  organizerId
  isRevealed
  currentOwnerAddress
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
 const DeleteEventPassPendingOrdersDocument = `
    mutation DeleteEventPassPendingOrders($ids: [uuid!]!) {
  delete_eventPassPendingOrder(where: {id: {_in: $ids}}) {
    affected_rows
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
 const UpsertNftTransferDocument = `
    mutation UpsertNftTransfer($objects: [nftTransfer_insert_input!]!) {
  insert_nftTransfer(
    objects: $objects
    on_conflict: {constraint: nft_transfer_unique_transfer, update_columns: []}
  ) {
    affected_rows
    returning {
      ...NftTransferFields
    }
  }
}
    ${NftTransferFieldsFragmentDoc}`;
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
      title
      id
      slug
      heroImage {
        url
      }
      eventPasses {
        name
        id
        description
        nftName
        nftImage {
          url
        }
        nftDescription
        eventPassPricing {
          maxAmount
        }
        eventNftCollection {
          contractAddress
        }
      }
    }
  }
}
    `;


 const GetEventNftCollectionByContractAddressWithMinimalEventPassesDocument = `
    query GetEventNftCollectionByContractAddressWithMinimalEventPasses($contractAddress: String!, $stage: Stage!) {
  eventNftCollection_by_pk(contractAddress: $contractAddress) {
    activityWebhookId
    chainId
    contractAddress
    eventPass {
      event {
        organizer {
          id
        }
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
    nftImage {
      url
    }
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
 const UpdateEventPassNftFromNftTransferDocument = `
    mutation UpdateEventPassNftFromNftTransfer($updates: [eventPassNft_updates!]!) {
  update_eventPassNft_many(updates: $updates) {
    affected_rows
    returning {
      id
      isRevealed
      currentOwnerAddress
      eventId
      eventPassId
      organizerId
      tokenId
      lastNftTransfer {
        fromAddress
      }
    }
  }
}
    `;
 const SetEventPassNftRevealedDocument = `
    mutation SetEventPassNftRevealed($id: uuid!) {
  update_eventPassNft_by_pk(pk_columns: {id: $id}, _set: {isRevealed: true}) {
    id
  }
}
    `;
 const GetEventPassNftByContractsAndTokenIdsDocument = `
    query GetEventPassNftByContractsAndTokenIds($contractAddresses: [String!]!, $chainId: String!, $tokenIds: [bigint!]!) @cached {
  eventPassNft(
    where: {contractAddress: {_in: $contractAddresses}, chainId: {_eq: $chainId}, tokenId: {_in: $tokenIds}}
  ) {
    tokenId
    eventId
    eventPassId
    organizerId
  }
}
    `;
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
 const GetEventPassesMaxAmountDocument = `
    query GetEventPassesMaxAmount($eventPassId: String) {
  eventPassPricing(where: {eventPassId: {_eq: $eventPassId}}) {
    maxAmount
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
 const GetEventPassNftByIdDocument = `
    query GetEventPassNftById($id: uuid!, $locale: Locale!, $stage: Stage!) @cached {
  eventPassNft_by_pk(id: $id) {
    ...EventPassNftFields
    eventPass(locales: [$locale, en], stage: $stage) {
      ...EventPassFields
    }
  }
}
    ${EventPassNftFieldsFragmentDoc}
${EventPassFieldsFragmentDoc}`;
 const GetEventPassNftByIdMinimalDocument = `
    query GetEventPassNftByIdMinimal($id: uuid!) {
  eventPassNft_by_pk(id: $id) {
    ...EventPassNftFields
  }
}
    ${EventPassNftFieldsFragmentDoc}`;
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
    UpsertEventPassOrders(variables: Types.UpsertEventPassOrdersMutationVariables, options?: C): Promise<Types.UpsertEventPassOrdersMutation> {
      return requester<Types.UpsertEventPassOrdersMutation, Types.UpsertEventPassOrdersMutationVariables>(UpsertEventPassOrdersDocument, variables, options) as Promise<Types.UpsertEventPassOrdersMutation>;
    },
    GetAccountEventPassOrderForEventPasses(variables: Types.GetAccountEventPassOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetAccountEventPassOrderForEventPassesQuery> {
      return requester<Types.GetAccountEventPassOrderForEventPassesQuery, Types.GetAccountEventPassOrderForEventPassesQueryVariables>(GetAccountEventPassOrderForEventPassesDocument, variables, options) as Promise<Types.GetAccountEventPassOrderForEventPassesQuery>;
    },
    DeleteEventPassPendingOrders(variables: Types.DeleteEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrdersMutation> {
      return requester<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrdersMutation>;
    },
    GetEventPassPendingOrders(variables?: Types.GetEventPassPendingOrdersQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrdersQuery> {
      return requester<Types.GetEventPassPendingOrdersQuery, Types.GetEventPassPendingOrdersQueryVariables>(GetEventPassPendingOrdersDocument, variables, options) as Promise<Types.GetEventPassPendingOrdersQuery>;
    },
    UpsertNftTransfer(variables: Types.UpsertNftTransferMutationVariables, options?: C): Promise<Types.UpsertNftTransferMutation> {
      return requester<Types.UpsertNftTransferMutation, Types.UpsertNftTransferMutationVariables>(UpsertNftTransferDocument, variables, options) as Promise<Types.UpsertNftTransferMutation>;
    },
    GetNftTransferByTxHash(variables: Types.GetNftTransferByTxHashQueryVariables, options?: C): Promise<Types.GetNftTransferByTxHashQuery> {
      return requester<Types.GetNftTransferByTxHashQuery, Types.GetNftTransferByTxHashQueryVariables>(GetNftTransferByTxHashDocument, variables, options) as Promise<Types.GetNftTransferByTxHashQuery>;
    },
    GetNftTransferByTokenIdAndCollection(variables: Types.GetNftTransferByTokenIdAndCollectionQueryVariables, options?: C): Promise<Types.GetNftTransferByTokenIdAndCollectionQuery> {
      return requester<Types.GetNftTransferByTokenIdAndCollectionQuery, Types.GetNftTransferByTokenIdAndCollectionQueryVariables>(GetNftTransferByTokenIdAndCollectionDocument, variables, options) as Promise<Types.GetNftTransferByTokenIdAndCollectionQuery>;
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
    UpdateEventPassNftFromNftTransfer(variables: Types.UpdateEventPassNftFromNftTransferMutationVariables, options?: C): Promise<Types.UpdateEventPassNftFromNftTransferMutation> {
      return requester<Types.UpdateEventPassNftFromNftTransferMutation, Types.UpdateEventPassNftFromNftTransferMutationVariables>(UpdateEventPassNftFromNftTransferDocument, variables, options) as Promise<Types.UpdateEventPassNftFromNftTransferMutation>;
    },
    SetEventPassNftRevealed(variables: Types.SetEventPassNftRevealedMutationVariables, options?: C): Promise<Types.SetEventPassNftRevealedMutation> {
      return requester<Types.SetEventPassNftRevealedMutation, Types.SetEventPassNftRevealedMutationVariables>(SetEventPassNftRevealedDocument, variables, options) as Promise<Types.SetEventPassNftRevealedMutation>;
    },
    GetEventPassNftByContractsAndTokenIds(variables: Types.GetEventPassNftByContractsAndTokenIdsQueryVariables, options?: C): Promise<Types.GetEventPassNftByContractsAndTokenIdsQuery> {
      return requester<Types.GetEventPassNftByContractsAndTokenIdsQuery, Types.GetEventPassNftByContractsAndTokenIdsQueryVariables>(GetEventPassNftByContractsAndTokenIdsDocument, variables, options) as Promise<Types.GetEventPassNftByContractsAndTokenIdsQuery>;
    },
    CreateEventPassPricing(variables: Types.CreateEventPassPricingMutationVariables, options?: C): Promise<Types.CreateEventPassPricingMutation> {
      return requester<Types.CreateEventPassPricingMutation, Types.CreateEventPassPricingMutationVariables>(CreateEventPassPricingDocument, variables, options) as Promise<Types.CreateEventPassPricingMutation>;
    },
    UpdateEventPassPricing(variables: Types.UpdateEventPassPricingMutationVariables, options?: C): Promise<Types.UpdateEventPassPricingMutation> {
      return requester<Types.UpdateEventPassPricingMutation, Types.UpdateEventPassPricingMutationVariables>(UpdateEventPassPricingDocument, variables, options) as Promise<Types.UpdateEventPassPricingMutation>;
    },
    GetEventPassesMaxAmount(variables?: Types.GetEventPassesMaxAmountQueryVariables, options?: C): Promise<Types.GetEventPassesMaxAmountQuery> {
      return requester<Types.GetEventPassesMaxAmountQuery, Types.GetEventPassesMaxAmountQueryVariables>(GetEventPassesMaxAmountDocument, variables, options) as Promise<Types.GetEventPassesMaxAmountQuery>;
    },
    GetOrganizer(variables: Types.GetOrganizerQueryVariables, options?: C): Promise<Types.GetOrganizerQuery> {
      return requester<Types.GetOrganizerQuery, Types.GetOrganizerQueryVariables>(GetOrganizerDocument, variables, options) as Promise<Types.GetOrganizerQuery>;
    },
    GetEventPassNftById(variables: Types.GetEventPassNftByIdQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdQuery> {
      return requester<Types.GetEventPassNftByIdQuery, Types.GetEventPassNftByIdQueryVariables>(GetEventPassNftByIdDocument, variables, options) as Promise<Types.GetEventPassNftByIdQuery>;
    },
    GetEventPassNftByIdMinimal(variables: Types.GetEventPassNftByIdMinimalQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdMinimalQuery> {
      return requester<Types.GetEventPassNftByIdMinimalQuery, Types.GetEventPassNftByIdMinimalQueryVariables>(GetEventPassNftByIdMinimalDocument, variables, options) as Promise<Types.GetEventPassNftByIdMinimalQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const adminSdk = getSdk(fetchData({admin:true}));