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
    width
    height
    url
  }
  heroImageClasses
}
    `;
export const OrganizerFieldsFragmentDoc = `
    fragment OrganizerFields on Organizer {
  id
  slug
  name
  image {
    url
  }
  imageClasses
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
    heroImageClasses
    organizer {
      id
      slug
      name
      image {
        url
      }
      imageClasses
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
export const RoleAssignmentsFieldsFragmentDoc = `
    fragment RoleAssignmentsFields on roleAssignments {
  role
  organizerId
  eventId
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
    roles {
      ...RoleAssignmentsFields
    }
  }
}
    ${AccountFieldsFragmentDoc}
${KycFieldsFragmentDoc}
${RoleAssignmentsFieldsFragmentDoc}`;
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
 const GetEventPassOrderFromIdDocument = `
    query GetEventPassOrderFromId($id: uuid!) {
  eventPassOrder_by_pk(id: $id) {
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
    eventPassPricing {
      priceAmount
    }
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
    eventPassPricing {
      priceAmount
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
      imageClasses
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
    heroImageClasses
    organizer {
      ...OrganizerFields
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
        timeBeforeDelete
      }
    }
  }
}
    ${OrganizerFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventsFromOrganizerIdTableDocument = `
    query GetEventsFromOrganizerIdTable($id: ID!, $locale: Locale!, $stage: Stage!) @cached {
  organizer(where: {id: $id}, locales: [$locale, en], stage: $stage) {
    events {
      title
      slug
      eventParameters {
        dateStart
        dateEnd
        dateSaleStart
        dateSaleEnd
        timezone
      }
    }
  }
}
    `;
 const GetEventWithPassesOrganizerDocument = `
    query GetEventWithPassesOrganizer($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  event(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
    title
    id
    slug
    heroImage {
      url
    }
    heroImageClasses
    eventPasses {
      name
      id
      description
      nftName
      nftImage {
        url
      }
      nftDescription
      passOptions {
        name
        description
        eventDateLocation {
          ...EventDateLocationsFields
        }
      }
      eventPassPricing {
        maxAmount
        maxAmountPerUser
        priceAmount
        priceCurrency
        timeBeforeDelete
      }
      eventPassNftContract {
        type
        contractAddress
        eventPassId
      }
    }
  }
}
    ${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventPassesDocument = `
    query GetEventPasses($eventSlug: String!, $locale: Locale!, $stage: Stage!) @cached {
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
  }
}
    ${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventPassDelayedRevealedFromEventPassIdDocument = `
    query GetEventPassDelayedRevealedFromEventPassId($eventPassId: ID!, $locale: Locale!, $stage: Stage!) @cached {
  eventPass(where: {id: $eventPassId}, locales: [$locale, en], stage: $stage) {
    eventPassDelayedRevealed {
      name
      description
      nftName
      nftDescription
      nftImage {
        url
      }
      passOptions {
        name
        description
        eventDateLocation {
          ...EventDateLocationsFields
        }
      }
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
 const GetEventPassNftContractDelayedRevealedFromEventPassIdDocument = `
    query GetEventPassNftContractDelayedRevealedFromEventPassId($eventPassId: String) @cached {
  eventPassNftContract(where: {eventPassId: {_eq: $eventPassId}}) {
    type
    isDelayedRevealed
  }
}
    `;
 const GetEventPassOrderSumsDocument = `
    query GetEventPassOrderSums($eventPassId: String!) {
  eventPassOrderSums_by_pk(eventPassId: $eventPassId) {
    totalReserved
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
 const DeleteFollowOrganizerDocument = `
    mutation DeleteFollowOrganizer($accountId: uuid!, $organizerSlug: String!) {
  delete_follow_by_pk(accountId: $accountId, organizerSlug: $organizerSlug) {
    organizerSlug
  }
}
    `;
 const CheckFollowingOrganizerDocument = `
    query CheckFollowingOrganizer($accountId: uuid!, $organizerSlug: String!) {
  follow_by_pk(accountId: $accountId, organizerSlug: $organizerSlug) {
    accountId
    organizerSlug
  }
}
    `;
 const GetOrganizerDocument = `
    query GetOrganizer($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  organizer(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
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
    imageClasses
    heroImage {
      url
    }
    heroImageClasses
    twitterHandle
    instagramHandle
    tiktokHandle
    facebookHandle
    youtubeHandle
    telegramHandle
    discordWidgetId
  }
}
    `;
 const GetOrganizerFromSlugDocument = `
    query GetOrganizerFromSlug($slug: String!, $stage: Stage!) @cached {
  organizer(where: {slug: $slug}, locales: [en], stage: $stage) {
    id
    slug
  }
}
    `;
 const GetOrganizerLatestEventsDocument = `
    query GetOrganizerLatestEvents($organizerId: String!, $locale: Locale!, $stage: Stage!) @cached {
  eventParameters(
    where: {organizerId: {_eq: $organizerId}}
    order_by: {dateStart: desc}
    limit: 3
  ) {
    dateStart
    dateEnd
    event(where: {}, locales: [$locale, en], stage: $stage) {
      slug
      title
      heroImage {
        url
      }
      heroImageClasses
    }
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
 const GetAlchemyInfosFromEventIdDocument = `
    query GetAlchemyInfosFromEventId($eventId: String) {
  eventParameters(where: {eventId: {_eq: $eventId}}) {
    activityWebhookId
    signingKey
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
 const CreateRoleAssignmentDocument = `
    mutation CreateRoleAssignment($input: roleAssignments_insert_input!) {
  insert_roleAssignments_one(object: $input) {
    role
  }
}
    `;
 const GetRoleMinimalDocument = `
    query GetRoleMinimal($accountId: uuid!, $role: roles_enum!, $organizerId: String!, $eventId: String) {
  roleAssignments(
    where: {accountId: {_eq: $accountId}, role: {_eq: $role}, organizerId: {_eq: $organizerId}, eventId: {_eq: $eventId}}
  ) {
    id
  }
}
    `;
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
    GetAccountByAddress(variables: Types.GetAccountByAddressQueryVariables, options?: C): Promise<Types.GetAccountByAddressQuery> {
      return requester<Types.GetAccountByAddressQuery, Types.GetAccountByAddressQueryVariables>(GetAccountByAddressDocument, variables, options) as Promise<Types.GetAccountByAddressQuery>;
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
    GetEventPassOrderFromId(variables: Types.GetEventPassOrderFromIdQueryVariables, options?: C): Promise<Types.GetEventPassOrderFromIdQuery> {
      return requester<Types.GetEventPassOrderFromIdQuery, Types.GetEventPassOrderFromIdQueryVariables>(GetEventPassOrderFromIdDocument, variables, options) as Promise<Types.GetEventPassOrderFromIdQuery>;
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
    GetEventsFromOrganizerIdTable(variables: Types.GetEventsFromOrganizerIdTableQueryVariables, options?: C): Promise<Types.GetEventsFromOrganizerIdTableQuery> {
      return requester<Types.GetEventsFromOrganizerIdTableQuery, Types.GetEventsFromOrganizerIdTableQueryVariables>(GetEventsFromOrganizerIdTableDocument, variables, options) as Promise<Types.GetEventsFromOrganizerIdTableQuery>;
    },
    GetEventWithPassesOrganizer(variables: Types.GetEventWithPassesOrganizerQueryVariables, options?: C): Promise<Types.GetEventWithPassesOrganizerQuery> {
      return requester<Types.GetEventWithPassesOrganizerQuery, Types.GetEventWithPassesOrganizerQueryVariables>(GetEventWithPassesOrganizerDocument, variables, options) as Promise<Types.GetEventWithPassesOrganizerQuery>;
    },
    GetEventPasses(variables: Types.GetEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassesQuery> {
      return requester<Types.GetEventPassesQuery, Types.GetEventPassesQueryVariables>(GetEventPassesDocument, variables, options) as Promise<Types.GetEventPassesQuery>;
    },
    GetEventPassDelayedRevealedFromEventPassId(variables: Types.GetEventPassDelayedRevealedFromEventPassIdQueryVariables, options?: C): Promise<Types.GetEventPassDelayedRevealedFromEventPassIdQuery> {
      return requester<Types.GetEventPassDelayedRevealedFromEventPassIdQuery, Types.GetEventPassDelayedRevealedFromEventPassIdQueryVariables>(GetEventPassDelayedRevealedFromEventPassIdDocument, variables, options) as Promise<Types.GetEventPassDelayedRevealedFromEventPassIdQuery>;
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
    GetEventPassNftContractDelayedRevealedFromEventPassId(variables?: Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQueryVariables, options?: C): Promise<Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQuery> {
      return requester<Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQuery, Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQueryVariables>(GetEventPassNftContractDelayedRevealedFromEventPassIdDocument, variables, options) as Promise<Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQuery>;
    },
    GetEventPassOrderSums(variables: Types.GetEventPassOrderSumsQueryVariables, options?: C): Promise<Types.GetEventPassOrderSumsQuery> {
      return requester<Types.GetEventPassOrderSumsQuery, Types.GetEventPassOrderSumsQueryVariables>(GetEventPassOrderSumsDocument, variables, options) as Promise<Types.GetEventPassOrderSumsQuery>;
    },
    CreateEventPassPricing(variables: Types.CreateEventPassPricingMutationVariables, options?: C): Promise<Types.CreateEventPassPricingMutation> {
      return requester<Types.CreateEventPassPricingMutation, Types.CreateEventPassPricingMutationVariables>(CreateEventPassPricingDocument, variables, options) as Promise<Types.CreateEventPassPricingMutation>;
    },
    UpdateEventPassPricing(variables: Types.UpdateEventPassPricingMutationVariables, options?: C): Promise<Types.UpdateEventPassPricingMutation> {
      return requester<Types.UpdateEventPassPricingMutation, Types.UpdateEventPassPricingMutationVariables>(UpdateEventPassPricingDocument, variables, options) as Promise<Types.UpdateEventPassPricingMutation>;
    },
    DeleteFollowOrganizer(variables: Types.DeleteFollowOrganizerMutationVariables, options?: C): Promise<Types.DeleteFollowOrganizerMutation> {
      return requester<Types.DeleteFollowOrganizerMutation, Types.DeleteFollowOrganizerMutationVariables>(DeleteFollowOrganizerDocument, variables, options) as Promise<Types.DeleteFollowOrganizerMutation>;
    },
    CheckFollowingOrganizer(variables: Types.CheckFollowingOrganizerQueryVariables, options?: C): Promise<Types.CheckFollowingOrganizerQuery> {
      return requester<Types.CheckFollowingOrganizerQuery, Types.CheckFollowingOrganizerQueryVariables>(CheckFollowingOrganizerDocument, variables, options) as Promise<Types.CheckFollowingOrganizerQuery>;
    },
    GetOrganizer(variables: Types.GetOrganizerQueryVariables, options?: C): Promise<Types.GetOrganizerQuery> {
      return requester<Types.GetOrganizerQuery, Types.GetOrganizerQueryVariables>(GetOrganizerDocument, variables, options) as Promise<Types.GetOrganizerQuery>;
    },
    GetOrganizerFromSlug(variables: Types.GetOrganizerFromSlugQueryVariables, options?: C): Promise<Types.GetOrganizerFromSlugQuery> {
      return requester<Types.GetOrganizerFromSlugQuery, Types.GetOrganizerFromSlugQueryVariables>(GetOrganizerFromSlugDocument, variables, options) as Promise<Types.GetOrganizerFromSlugQuery>;
    },
    GetOrganizerLatestEvents(variables: Types.GetOrganizerLatestEventsQueryVariables, options?: C): Promise<Types.GetOrganizerLatestEventsQuery> {
      return requester<Types.GetOrganizerLatestEventsQuery, Types.GetOrganizerLatestEventsQueryVariables>(GetOrganizerLatestEventsDocument, variables, options) as Promise<Types.GetOrganizerLatestEventsQuery>;
    },
    InsertEventParameters(variables: Types.InsertEventParametersMutationVariables, options?: C): Promise<Types.InsertEventParametersMutation> {
      return requester<Types.InsertEventParametersMutation, Types.InsertEventParametersMutationVariables>(InsertEventParametersDocument, variables, options) as Promise<Types.InsertEventParametersMutation>;
    },
    GetAlchemyInfosFromEventId(variables?: Types.GetAlchemyInfosFromEventIdQueryVariables, options?: C): Promise<Types.GetAlchemyInfosFromEventIdQuery> {
      return requester<Types.GetAlchemyInfosFromEventIdQuery, Types.GetAlchemyInfosFromEventIdQueryVariables>(GetAlchemyInfosFromEventIdDocument, variables, options) as Promise<Types.GetAlchemyInfosFromEventIdQuery>;
    },
    GetEventPassNftById(variables: Types.GetEventPassNftByIdQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdQuery> {
      return requester<Types.GetEventPassNftByIdQuery, Types.GetEventPassNftByIdQueryVariables>(GetEventPassNftByIdDocument, variables, options) as Promise<Types.GetEventPassNftByIdQuery>;
    },
    GetEventPassNftByIdMinimal(variables: Types.GetEventPassNftByIdMinimalQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdMinimalQuery> {
      return requester<Types.GetEventPassNftByIdMinimalQuery, Types.GetEventPassNftByIdMinimalQueryVariables>(GetEventPassNftByIdMinimalDocument, variables, options) as Promise<Types.GetEventPassNftByIdMinimalQuery>;
    },
    CreateRoleAssignment(variables: Types.CreateRoleAssignmentMutationVariables, options?: C): Promise<Types.CreateRoleAssignmentMutation> {
      return requester<Types.CreateRoleAssignmentMutation, Types.CreateRoleAssignmentMutationVariables>(CreateRoleAssignmentDocument, variables, options) as Promise<Types.CreateRoleAssignmentMutation>;
    },
    GetRoleMinimal(variables: Types.GetRoleMinimalQueryVariables, options?: C): Promise<Types.GetRoleMinimalQuery> {
      return requester<Types.GetRoleMinimalQuery, Types.GetRoleMinimalQueryVariables>(GetRoleMinimalDocument, variables, options) as Promise<Types.GetRoleMinimalQuery>;
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