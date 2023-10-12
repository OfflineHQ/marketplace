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
export const KycFieldsFragmentDoc = `
    fragment KycFields on kyc {
  applicantId
  reviewStatus
  levelName
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
export const StripeCheckoutSessionFieldsFragmentDoc = `
    fragment StripeCheckoutSessionFields on stripeCheckoutSession {
  stripeSessionId
  stripeCustomerId
  type
}
    `;
export const StripeCustomerFieldsFragmentDoc = `
    fragment StripeCustomerFields on stripeCustomer {
  stripeCustomerId
  accountId
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
  }
}
    ${AccountFieldsFragmentDoc}
${KycFieldsFragmentDoc}`;
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
 const GetAccountByIdDocument = `
    query GetAccountById($id: uuid!) {
  account(where: {id: {_eq: $id}}) {
    address
  }
}
    `;
 const UpdateEventPassOrdersStatusDocument = `
    mutation UpdateEventPassOrdersStatus($updates: [eventPassOrder_updates!]!) {
  update_eventPassOrder_many(updates: $updates) {
    affected_rows
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
 const SetEventPassOrdersStripeCheckoutSessionIdDocument = `
    mutation SetEventPassOrdersStripeCheckoutSessionId($updates: [eventPassOrder_updates!]!) {
  update_eventPassOrder_many(updates: $updates) {
    affected_rows
    returning {
      id
      quantity
      status
      eventPassId
      accountId
      created_at
      stripeCheckoutSessionId
    }
  }
}
    `;
 const MoveEventPassPendingOrdersToConfirmedDocument = `
    mutation MoveEventPassPendingOrdersToConfirmed($eventPassPendingOrderIds: [uuid!]!, $objects: [eventPassOrder_insert_input!]!, $locale: Locale!, $stage: Stage!) {
  delete_eventPassPendingOrder(where: {id: {_in: $eventPassPendingOrderIds}}) {
    affected_rows
  }
  insert_eventPassOrder(objects: $objects) {
    returning {
      id
      quantity
      status
      eventPassId
      accountId
      created_at
      eventPassPricing {
        priceAmount
        priceCurrency
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
 const GetEventPassOrdersFromStripeCheckoutSessionDocument = `
    query GetEventPassOrdersFromStripeCheckoutSession($stripeCheckoutSessionId: String!) {
  eventPassOrder(
    where: {stripeCheckoutSessionId: {_eq: $stripeCheckoutSessionId}}
  ) {
    id
    eventPassId
    quantity
    status
    eventPassNftContract {
      contractAddress
    }
    account {
      address
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
 const GetEventsFromOrganizerIdDocument = `
    query GetEventsFromOrganizerId($id: ID!, $locale: Locale!, $stage: Stage!) @cached {
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
        eventPassNftContract {
          contractAddress
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
 const InsertEventPassNftsDocument = `
    mutation InsertEventPassNfts($objects: [eventPassNft_insert_input!]!) {
  insert_eventPassNft(objects: $objects) {
    affected_rows
    returning {
      contractAddress
      tokenId
      metadata
      error
      tokenUri
      chainId
      eventId
      eventPassId
      organizerId
      currentOwnerAddress
      lastNftTransferId
      isRevealed
      id
      created_at
      updated_at
    }
  }
}
    `;
 const ClaimEventPassNftsDocument = `
    mutation ClaimEventPassNfts($updates: [eventPassNft_updates!]!) {
  update_eventPassNft_many(updates: $updates) {
    affected_rows
    returning {
      id
      currentOwnerAddress
      eventId
      eventPassId
      organizerId
      tokenId
    }
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
 const CreateEventPassNftContractDocument = `
    mutation CreateEventPassNftContract($object: eventPassNftContract_insert_input!) {
  insert_eventPassNftContract_one(object: $object) {
    chainId
    contractAddress
    eventId
    eventPassId
    organizerId
  }
}
    `;
 const GetContractAddressFromEventPassIdDocument = `
    query GetContractAddressFromEventPassId($eventPassId: String) @cached {
  eventPassNftContract(where: {eventPassId: {_eq: $eventPassId}}) {
    contractAddress
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
 const GetOrganizerDocument = `
    query GetOrganizer($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  organizer(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
    ...OrganizerFields
  }
}
    ${OrganizerFieldsFragmentDoc}`;
 const GetSigningKeyFromEventIdDocument = `
    query GetSigningKeyFromEventId($eventId: String) {
  eventParameters(where: {eventId: {_eq: $eventId}}) {
    signingKey
  }
}
    `;
 const InsertEventParametersDocument = `
    mutation InsertEventParameters($objects: [eventParameters_insert_input!]!) {
  insert_eventParameters(objects: $objects) {
    returning {
      id
      activityWebhookId
      eventId
    }
  }
}
    `;
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
 const CreateStripeCheckoutSessionDocument = `
    mutation CreateStripeCheckoutSession($stripeCheckoutSession: stripeCheckoutSession_insert_input!) {
  insert_stripeCheckoutSession_one(object: $stripeCheckoutSession) {
    ...StripeCheckoutSessionFields
  }
}
    ${StripeCheckoutSessionFieldsFragmentDoc}`;
 const DeleteStripeCheckoutSessionDocument = `
    mutation DeleteStripeCheckoutSession($stripeSessionId: String!) {
  delete_stripeCheckoutSession_by_pk(stripeSessionId: $stripeSessionId) {
    ...StripeCheckoutSessionFields
  }
}
    ${StripeCheckoutSessionFieldsFragmentDoc}`;
 const GetStripeCheckoutSessionForUserDocument = `
    query GetStripeCheckoutSessionForUser($stripeCustomerId: String!) {
  stripeCheckoutSession(where: {stripeCustomerId: {_eq: $stripeCustomerId}}) {
    ...StripeCheckoutSessionFields
  }
}
    ${StripeCheckoutSessionFieldsFragmentDoc}`;
 const CreateStripeCustomerDocument = `
    mutation CreateStripeCustomer($stripeCustomer: stripeCustomer_insert_input!) {
  insert_stripeCustomer_one(object: $stripeCustomer) {
    ...StripeCustomerFields
  }
}
    ${StripeCustomerFieldsFragmentDoc}`;
 const UpdateStripeCustomerDocument = `
    mutation UpdateStripeCustomer($stripeCustomerId: String!, $stripeCustomer: stripeCustomer_set_input!) {
  update_stripeCustomer_by_pk(
    pk_columns: {stripeCustomerId: $stripeCustomerId}
    _set: $stripeCustomer
  ) {
    ...StripeCustomerFields
  }
}
    ${StripeCustomerFieldsFragmentDoc}`;
 const GetStripeCustomerByAccountDocument = `
    query GetStripeCustomerByAccount($accountId: uuid!) {
  stripeCustomer(where: {accountId: {_eq: $accountId}}) {
    ...StripeCustomerFields
  }
}
    ${StripeCustomerFieldsFragmentDoc}`;
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
    GetAccountById(variables: Types.GetAccountByIdQueryVariables, options?: C): Promise<Types.GetAccountByIdQuery> {
      return requester<Types.GetAccountByIdQuery, Types.GetAccountByIdQueryVariables>(GetAccountByIdDocument, variables, options) as Promise<Types.GetAccountByIdQuery>;
    },
    UpdateEventPassOrdersStatus(variables: Types.UpdateEventPassOrdersStatusMutationVariables, options?: C): Promise<Types.UpdateEventPassOrdersStatusMutation> {
      return requester<Types.UpdateEventPassOrdersStatusMutation, Types.UpdateEventPassOrdersStatusMutationVariables>(UpdateEventPassOrdersStatusDocument, variables, options) as Promise<Types.UpdateEventPassOrdersStatusMutation>;
    },
    SetEventPassOrdersStripeCheckoutSessionId(variables: Types.SetEventPassOrdersStripeCheckoutSessionIdMutationVariables, options?: C): Promise<Types.SetEventPassOrdersStripeCheckoutSessionIdMutation> {
      return requester<Types.SetEventPassOrdersStripeCheckoutSessionIdMutation, Types.SetEventPassOrdersStripeCheckoutSessionIdMutationVariables>(SetEventPassOrdersStripeCheckoutSessionIdDocument, variables, options) as Promise<Types.SetEventPassOrdersStripeCheckoutSessionIdMutation>;
    },
    MoveEventPassPendingOrdersToConfirmed(variables: Types.MoveEventPassPendingOrdersToConfirmedMutationVariables, options?: C): Promise<Types.MoveEventPassPendingOrdersToConfirmedMutation> {
      return requester<Types.MoveEventPassPendingOrdersToConfirmedMutation, Types.MoveEventPassPendingOrdersToConfirmedMutationVariables>(MoveEventPassPendingOrdersToConfirmedDocument, variables, options) as Promise<Types.MoveEventPassPendingOrdersToConfirmedMutation>;
    },
    GetAccountEventPassOrderForEventPasses(variables: Types.GetAccountEventPassOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetAccountEventPassOrderForEventPassesQuery> {
      return requester<Types.GetAccountEventPassOrderForEventPassesQuery, Types.GetAccountEventPassOrderForEventPassesQueryVariables>(GetAccountEventPassOrderForEventPassesDocument, variables, options) as Promise<Types.GetAccountEventPassOrderForEventPassesQuery>;
    },
    GetEventPassOrdersFromStripeCheckoutSession(variables: Types.GetEventPassOrdersFromStripeCheckoutSessionQueryVariables, options?: C): Promise<Types.GetEventPassOrdersFromStripeCheckoutSessionQuery> {
      return requester<Types.GetEventPassOrdersFromStripeCheckoutSessionQuery, Types.GetEventPassOrdersFromStripeCheckoutSessionQueryVariables>(GetEventPassOrdersFromStripeCheckoutSessionDocument, variables, options) as Promise<Types.GetEventPassOrdersFromStripeCheckoutSessionQuery>;
    },
    DeleteEventPassPendingOrders(variables: Types.DeleteEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrdersMutation> {
      return requester<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrdersMutation>;
    },
    GetEventPassPendingOrders(variables?: Types.GetEventPassPendingOrdersQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrdersQuery> {
      return requester<Types.GetEventPassPendingOrdersQuery, Types.GetEventPassPendingOrdersQueryVariables>(GetEventPassPendingOrdersDocument, variables, options) as Promise<Types.GetEventPassPendingOrdersQuery>;
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
    UpsertNftTransfer(variables: Types.UpsertNftTransferMutationVariables, options?: C): Promise<Types.UpsertNftTransferMutation> {
      return requester<Types.UpsertNftTransferMutation, Types.UpsertNftTransferMutationVariables>(UpsertNftTransferDocument, variables, options) as Promise<Types.UpsertNftTransferMutation>;
    },
    GetNftTransferByTxHash(variables: Types.GetNftTransferByTxHashQueryVariables, options?: C): Promise<Types.GetNftTransferByTxHashQuery> {
      return requester<Types.GetNftTransferByTxHashQuery, Types.GetNftTransferByTxHashQueryVariables>(GetNftTransferByTxHashDocument, variables, options) as Promise<Types.GetNftTransferByTxHashQuery>;
    },
    GetNftTransferByTokenIdAndCollection(variables: Types.GetNftTransferByTokenIdAndCollectionQueryVariables, options?: C): Promise<Types.GetNftTransferByTokenIdAndCollectionQuery> {
      return requester<Types.GetNftTransferByTokenIdAndCollectionQuery, Types.GetNftTransferByTokenIdAndCollectionQueryVariables>(GetNftTransferByTokenIdAndCollectionDocument, variables, options) as Promise<Types.GetNftTransferByTokenIdAndCollectionQuery>;
    },
    GetEvent(variables: Types.GetEventQueryVariables, options?: C): Promise<Types.GetEventQuery> {
      return requester<Types.GetEventQuery, Types.GetEventQueryVariables>(GetEventDocument, variables, options) as Promise<Types.GetEventQuery>;
    },
    GetEventWithPasses(variables: Types.GetEventWithPassesQueryVariables, options?: C): Promise<Types.GetEventWithPassesQuery> {
      return requester<Types.GetEventWithPassesQuery, Types.GetEventWithPassesQueryVariables>(GetEventWithPassesDocument, variables, options) as Promise<Types.GetEventWithPassesQuery>;
    },
    GetEventsFromOrganizerId(variables: Types.GetEventsFromOrganizerIdQueryVariables, options?: C): Promise<Types.GetEventsFromOrganizerIdQuery> {
      return requester<Types.GetEventsFromOrganizerIdQuery, Types.GetEventsFromOrganizerIdQueryVariables>(GetEventsFromOrganizerIdDocument, variables, options) as Promise<Types.GetEventsFromOrganizerIdQuery>;
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
    InsertEventPassNfts(variables: Types.InsertEventPassNftsMutationVariables, options?: C): Promise<Types.InsertEventPassNftsMutation> {
      return requester<Types.InsertEventPassNftsMutation, Types.InsertEventPassNftsMutationVariables>(InsertEventPassNftsDocument, variables, options) as Promise<Types.InsertEventPassNftsMutation>;
    },
    ClaimEventPassNfts(variables: Types.ClaimEventPassNftsMutationVariables, options?: C): Promise<Types.ClaimEventPassNftsMutation> {
      return requester<Types.ClaimEventPassNftsMutation, Types.ClaimEventPassNftsMutationVariables>(ClaimEventPassNftsDocument, variables, options) as Promise<Types.ClaimEventPassNftsMutation>;
    },
    GetEventPassNftByContractsAndTokenIds(variables: Types.GetEventPassNftByContractsAndTokenIdsQueryVariables, options?: C): Promise<Types.GetEventPassNftByContractsAndTokenIdsQuery> {
      return requester<Types.GetEventPassNftByContractsAndTokenIdsQuery, Types.GetEventPassNftByContractsAndTokenIdsQueryVariables>(GetEventPassNftByContractsAndTokenIdsDocument, variables, options) as Promise<Types.GetEventPassNftByContractsAndTokenIdsQuery>;
    },
    CreateEventPassNftContract(variables: Types.CreateEventPassNftContractMutationVariables, options?: C): Promise<Types.CreateEventPassNftContractMutation> {
      return requester<Types.CreateEventPassNftContractMutation, Types.CreateEventPassNftContractMutationVariables>(CreateEventPassNftContractDocument, variables, options) as Promise<Types.CreateEventPassNftContractMutation>;
    },
    GetContractAddressFromEventPassId(variables?: Types.GetContractAddressFromEventPassIdQueryVariables, options?: C): Promise<Types.GetContractAddressFromEventPassIdQuery> {
      return requester<Types.GetContractAddressFromEventPassIdQuery, Types.GetContractAddressFromEventPassIdQueryVariables>(GetContractAddressFromEventPassIdDocument, variables, options) as Promise<Types.GetContractAddressFromEventPassIdQuery>;
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
    GetSigningKeyFromEventId(variables?: Types.GetSigningKeyFromEventIdQueryVariables, options?: C): Promise<Types.GetSigningKeyFromEventIdQuery> {
      return requester<Types.GetSigningKeyFromEventIdQuery, Types.GetSigningKeyFromEventIdQueryVariables>(GetSigningKeyFromEventIdDocument, variables, options) as Promise<Types.GetSigningKeyFromEventIdQuery>;
    },
    InsertEventParameters(variables: Types.InsertEventParametersMutationVariables, options?: C): Promise<Types.InsertEventParametersMutation> {
      return requester<Types.InsertEventParametersMutation, Types.InsertEventParametersMutationVariables>(InsertEventParametersDocument, variables, options) as Promise<Types.InsertEventParametersMutation>;
    },
    GetEventPassNftById(variables: Types.GetEventPassNftByIdQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdQuery> {
      return requester<Types.GetEventPassNftByIdQuery, Types.GetEventPassNftByIdQueryVariables>(GetEventPassNftByIdDocument, variables, options) as Promise<Types.GetEventPassNftByIdQuery>;
    },
    GetEventPassNftByIdMinimal(variables: Types.GetEventPassNftByIdMinimalQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdMinimalQuery> {
      return requester<Types.GetEventPassNftByIdMinimalQuery, Types.GetEventPassNftByIdMinimalQueryVariables>(GetEventPassNftByIdMinimalDocument, variables, options) as Promise<Types.GetEventPassNftByIdMinimalQuery>;
    },
    CreateStripeCheckoutSession(variables: Types.CreateStripeCheckoutSessionMutationVariables, options?: C): Promise<Types.CreateStripeCheckoutSessionMutation> {
      return requester<Types.CreateStripeCheckoutSessionMutation, Types.CreateStripeCheckoutSessionMutationVariables>(CreateStripeCheckoutSessionDocument, variables, options) as Promise<Types.CreateStripeCheckoutSessionMutation>;
    },
    DeleteStripeCheckoutSession(variables: Types.DeleteStripeCheckoutSessionMutationVariables, options?: C): Promise<Types.DeleteStripeCheckoutSessionMutation> {
      return requester<Types.DeleteStripeCheckoutSessionMutation, Types.DeleteStripeCheckoutSessionMutationVariables>(DeleteStripeCheckoutSessionDocument, variables, options) as Promise<Types.DeleteStripeCheckoutSessionMutation>;
    },
    GetStripeCheckoutSessionForUser(variables: Types.GetStripeCheckoutSessionForUserQueryVariables, options?: C): Promise<Types.GetStripeCheckoutSessionForUserQuery> {
      return requester<Types.GetStripeCheckoutSessionForUserQuery, Types.GetStripeCheckoutSessionForUserQueryVariables>(GetStripeCheckoutSessionForUserDocument, variables, options) as Promise<Types.GetStripeCheckoutSessionForUserQuery>;
    },
    CreateStripeCustomer(variables: Types.CreateStripeCustomerMutationVariables, options?: C): Promise<Types.CreateStripeCustomerMutation> {
      return requester<Types.CreateStripeCustomerMutation, Types.CreateStripeCustomerMutationVariables>(CreateStripeCustomerDocument, variables, options) as Promise<Types.CreateStripeCustomerMutation>;
    },
    UpdateStripeCustomer(variables: Types.UpdateStripeCustomerMutationVariables, options?: C): Promise<Types.UpdateStripeCustomerMutation> {
      return requester<Types.UpdateStripeCustomerMutation, Types.UpdateStripeCustomerMutationVariables>(UpdateStripeCustomerDocument, variables, options) as Promise<Types.UpdateStripeCustomerMutation>;
    },
    GetStripeCustomerByAccount(variables: Types.GetStripeCustomerByAccountQueryVariables, options?: C): Promise<Types.GetStripeCustomerByAccountQuery> {
      return requester<Types.GetStripeCustomerByAccountQuery, Types.GetStripeCustomerByAccountQueryVariables>(GetStripeCustomerByAccountDocument, variables, options) as Promise<Types.GetStripeCustomerByAccountQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const adminSdk = getSdk(fetchData({admin:true}));