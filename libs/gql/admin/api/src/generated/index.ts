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
  packId
  packAmount
  tokenId
  created_at
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
export const EventParametersFieldsFragmentDoc = `
    fragment EventParametersFields on eventParameters {
  dateStart
  dateEnd
  dateSaleStart
  dateSaleEnd
  timezone
  status
  isSaleOngoing
  isOngoing
}
    `;
export const PassAmountFieldsFragmentDoc = `
    fragment PassAmountFields on passAmount {
  maxAmount
  maxAmountPerUser
  timeBeforeDelete
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
export const PassPricingFieldsFragmentDoc = `
    fragment PassPricingFields on passPricing {
  amount
  currency
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
  passPricing {
    ...PassPricingFields
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
    ${EventDateLocationsFieldsFragmentDoc}
${PassPricingFieldsFragmentDoc}`;
export const EventPassNftFieldsFragmentDoc = `
    fragment EventPassNftFields on eventPassNft {
  id
  tokenId
  eventId
  eventPassId
  packId
  organizerId
  isRevealed
  currentOwnerAddress
}
    `;
export const RoleAssignmentFieldsFragmentDoc = `
    fragment RoleAssignmentFields on roleAssignment {
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
 const UpdateOrdersStatusDocument = `
    mutation UpdateOrdersStatus($updates: [order_updates!]!) {
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
 const SetOrdersStripeCheckoutSessionIdDocument = `
    mutation SetOrdersStripeCheckoutSessionId($updates: [order_updates!]!) {
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
    mutation MovePendingOrdersToConfirmed($pendingOrderIds: [uuid!]!, $objects: [order_insert_input!]!, $locale: Locale!, $stage: Stage!) {
  delete_pendingOrder(where: {id: {_in: $pendingOrderIds}}) {
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
    packNftContract {
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
    packNftContract {
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
    packAmount {
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
    eventParameters {
      ...EventParametersFields
    }
    eventDateLocations {
      ...EventDateLocationsFields
    }
  }
}
    ${EventListFieldsFragmentDoc}
${EventParametersFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventWithParametersDocument = `
    query GetEventWithParameters($slug: String!, $locale: Locale!, $stage: Stage!) @cached {
  event(where: {slug: $slug}, locales: [$locale, en], stage: $stage) {
    eventParameters {
      ...EventParametersFields
    }
  }
}
    ${EventParametersFieldsFragmentDoc}`;
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
    eventParameters {
      ...EventParametersFields
    }
    eventPasses {
      id
      name
      description
      passAmount {
        ...PassAmountFields
      }
      passPricing {
        ...PassPricingFields
      }
    }
  }
}
    ${OrganizerFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}
${EventParametersFieldsFragmentDoc}
${PassAmountFieldsFragmentDoc}
${PassPricingFieldsFragmentDoc}`;
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
        status
        isSaleOngoing
        isOngoing
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
      passAmount {
        ...PassAmountFields
      }
      passPricing {
        ...PassPricingFields
      }
      eventPassNftContract {
        type
        contractAddress
        eventPassId
        isDelayedRevealed
      }
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
}
    ${EventDateLocationsFieldsFragmentDoc}
${PassAmountFieldsFragmentDoc}
${PassPricingFieldsFragmentDoc}`;
 const GetEventParametersAndEventPassesDocument = `
    query GetEventParametersAndEventPasses($eventSlug: String!, $locale: Locale!, $stage: Stage!) @cached {
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
    passAmount {
      ...PassAmountFields
    }
    passPricing {
      ...PassPricingFields
    }
    passOptions {
      name
      description
      eventDateLocation {
        ...EventDateLocationsFields
      }
    }
    eventPassNftContract {
      type
      isDelayedRevealed
    }
  }
  event(where: {slug: $eventSlug}, locales: [$locale, en], stage: $stage) {
    organizer {
      slug
    }
    eventParameters {
      ...EventParametersFields
    }
  }
}
    ${PassAmountFieldsFragmentDoc}
${PassPricingFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}
${EventParametersFieldsFragmentDoc}`;
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
 const UpdateNftsWithPackIdDocument = `
    mutation UpdateNftsWithPackId($updates: [eventPassNft_updates!]!) {
  update_eventPassNft_many(updates: $updates) {
    affected_rows
    returning {
      id
      contractAddress
      tokenId
      packId
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
 const GetListCurrentOwnerAddressForContractAddressDocument = `
    query GetListCurrentOwnerAddressForContractAddress($contractAddress: String) {
  eventPassNft(where: {contractAddress: {_eq: $contractAddress}}) {
    currentOwnerAddress
    tokenId
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
 const UpdateEventPassNftContractDelayedRevealStatusDocument = `
    mutation UpdateEventPassNftContractDelayedRevealStatus($contractAddress: String) {
  update_eventPassNftContract(
    where: {contractAddress: {_eq: $contractAddress}}
    _set: {isDelayedRevealed: true}
  ) {
    affected_rows
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
 const GetEventPassNftContractDelayedRevealPasswordDocument = `
    query GetEventPassNftContractDelayedRevealPassword($contractAddress: String) @cached {
  eventPassNftContract(where: {contractAddress: {_eq: $contractAddress}}) {
    type
    isDelayedRevealed
    password
  }
}
    `;
 const GetEventPassNftContractNftsDocument = `
    query GetEventPassNftContractNfts($eventPassId: String) @cached {
  eventPassNftContract(where: {eventPassId: {_eq: $eventPassId}}) {
    contractAddress
    eventPassId
    eventPassNfts {
      id
      packId
      currentOwnerAddress
      contractAddress
      eventId
      tokenId
      eventPassId
    }
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
 const CreatePackNftContractDocument = `
    mutation CreatePackNftContract($object: packNftContract_insert_input!) {
  insert_packNftContract_one(object: $object) {
    id
    chainId
    contractAddress
    eventPassIds
    organizerId
    rewardsPerPack
    packId
  }
}
    `;
 const GetPackNftContractFromPackIdDocument = `
    query GetPackNftContractFromPackId($packId: String) @cached {
  packNftContract(where: {packId: {_eq: $packId}}) {
    id
    chainId
    rewardsPerPack
    organizerId
    contractAddress
    eventPassIds
    eventPassNfts {
      tokenId
      contractAddress
      currentOwnerAddress
      eventPassId
      packId
    }
  }
}
    `;
 const CreatePassAmountDocument = `
    mutation CreatePassAmount($passAmount: passAmount_insert_input!) {
  insert_passAmount_one(object: $passAmount) {
    id
    eventPassId
    packId
    maxAmount
    maxAmountPerUser
    timeBeforeDelete
  }
}
    `;
 const UpdatePassAmountDocument = `
    mutation UpdatePassAmount($id: uuid!, $passAmount: passAmount_set_input!) {
  update_passAmount_by_pk(pk_columns: {id: $id}, _set: $passAmount) {
    id
    eventPassId
    packId
    maxAmount
    maxAmountPerUser
    timeBeforeDelete
  }
}
    `;
 const CreatePassPricingDocument = `
    mutation CreatePassPricing($passPricing: passPricing_insert_input!) {
  insert_passPricing_one(object: $passPricing) {
    id
    eventPassId
    packId
    amount
    currency
  }
}
    `;
 const UpdatePassPricingDocument = `
    mutation UpdatePassPricing($id: uuid!, $passPricing: passPricing_set_input!) {
  update_passPricing_by_pk(pk_columns: {id: $id}, _set: $passPricing) {
    id
    eventPassId
    packId
    amount
    currency
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
    where: {organizerId: {_eq: $organizerId}, status: {_eq: PUBLISHED}}
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
 const CreateEventParametersDocument = `
    mutation CreateEventParameters($object: eventParameters_insert_input!) {
  insert_eventParameters_one(object: $object) {
    id
    activityWebhookId
    eventId
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
 const GetEventParametersDocument = `
    query GetEventParameters($eventId: String) {
  eventParameters(where: {eventId: {_eq: $eventId}}) {
    dateStart
    dateEnd
    dateSaleStart
    dateSaleEnd
    timezone
    status
    isSaleOngoing
    isOngoing
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
 const GetEventPassNftByIdWithEventPassNftContractDocument = `
    query GetEventPassNftByIdWithEventPassNftContract($id: uuid!) {
  eventPassNft_by_pk(id: $id) {
    ...EventPassNftFields
    eventPassNftContract {
      type
      isDelayedRevealed
    }
  }
}
    ${EventPassNftFieldsFragmentDoc}`;
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
    UpdateOrdersStatus(variables: Types.UpdateOrdersStatusMutationVariables, options?: C): Promise<Types.UpdateOrdersStatusMutation> {
      return requester<Types.UpdateOrdersStatusMutation, Types.UpdateOrdersStatusMutationVariables>(UpdateOrdersStatusDocument, variables, options) as Promise<Types.UpdateOrdersStatusMutation>;
    },
    SetOrdersStripeCheckoutSessionId(variables: Types.SetOrdersStripeCheckoutSessionIdMutationVariables, options?: C): Promise<Types.SetOrdersStripeCheckoutSessionIdMutation> {
      return requester<Types.SetOrdersStripeCheckoutSessionIdMutation, Types.SetOrdersStripeCheckoutSessionIdMutationVariables>(SetOrdersStripeCheckoutSessionIdDocument, variables, options) as Promise<Types.SetOrdersStripeCheckoutSessionIdMutation>;
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
    GetEventWithParameters(variables: Types.GetEventWithParametersQueryVariables, options?: C): Promise<Types.GetEventWithParametersQuery> {
      return requester<Types.GetEventWithParametersQuery, Types.GetEventWithParametersQueryVariables>(GetEventWithParametersDocument, variables, options) as Promise<Types.GetEventWithParametersQuery>;
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
    GetEventParametersAndEventPasses(variables: Types.GetEventParametersAndEventPassesQueryVariables, options?: C): Promise<Types.GetEventParametersAndEventPassesQuery> {
      return requester<Types.GetEventParametersAndEventPassesQuery, Types.GetEventParametersAndEventPassesQueryVariables>(GetEventParametersAndEventPassesDocument, variables, options) as Promise<Types.GetEventParametersAndEventPassesQuery>;
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
    UpdateNftsWithPackId(variables: Types.UpdateNftsWithPackIdMutationVariables, options?: C): Promise<Types.UpdateNftsWithPackIdMutation> {
      return requester<Types.UpdateNftsWithPackIdMutation, Types.UpdateNftsWithPackIdMutationVariables>(UpdateNftsWithPackIdDocument, variables, options) as Promise<Types.UpdateNftsWithPackIdMutation>;
    },
    GetEventPassNftByContractsAndTokenIds(variables: Types.GetEventPassNftByContractsAndTokenIdsQueryVariables, options?: C): Promise<Types.GetEventPassNftByContractsAndTokenIdsQuery> {
      return requester<Types.GetEventPassNftByContractsAndTokenIdsQuery, Types.GetEventPassNftByContractsAndTokenIdsQueryVariables>(GetEventPassNftByContractsAndTokenIdsDocument, variables, options) as Promise<Types.GetEventPassNftByContractsAndTokenIdsQuery>;
    },
    GetListCurrentOwnerAddressForContractAddress(variables?: Types.GetListCurrentOwnerAddressForContractAddressQueryVariables, options?: C): Promise<Types.GetListCurrentOwnerAddressForContractAddressQuery> {
      return requester<Types.GetListCurrentOwnerAddressForContractAddressQuery, Types.GetListCurrentOwnerAddressForContractAddressQueryVariables>(GetListCurrentOwnerAddressForContractAddressDocument, variables, options) as Promise<Types.GetListCurrentOwnerAddressForContractAddressQuery>;
    },
    CreateEventPassNftContract(variables: Types.CreateEventPassNftContractMutationVariables, options?: C): Promise<Types.CreateEventPassNftContractMutation> {
      return requester<Types.CreateEventPassNftContractMutation, Types.CreateEventPassNftContractMutationVariables>(CreateEventPassNftContractDocument, variables, options) as Promise<Types.CreateEventPassNftContractMutation>;
    },
    UpdateEventPassNftContractDelayedRevealStatus(variables?: Types.UpdateEventPassNftContractDelayedRevealStatusMutationVariables, options?: C): Promise<Types.UpdateEventPassNftContractDelayedRevealStatusMutation> {
      return requester<Types.UpdateEventPassNftContractDelayedRevealStatusMutation, Types.UpdateEventPassNftContractDelayedRevealStatusMutationVariables>(UpdateEventPassNftContractDelayedRevealStatusDocument, variables, options) as Promise<Types.UpdateEventPassNftContractDelayedRevealStatusMutation>;
    },
    GetContractAddressFromEventPassId(variables?: Types.GetContractAddressFromEventPassIdQueryVariables, options?: C): Promise<Types.GetContractAddressFromEventPassIdQuery> {
      return requester<Types.GetContractAddressFromEventPassIdQuery, Types.GetContractAddressFromEventPassIdQueryVariables>(GetContractAddressFromEventPassIdDocument, variables, options) as Promise<Types.GetContractAddressFromEventPassIdQuery>;
    },
    GetEventPassNftContractDelayedRevealedFromEventPassId(variables?: Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQueryVariables, options?: C): Promise<Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQuery> {
      return requester<Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQuery, Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQueryVariables>(GetEventPassNftContractDelayedRevealedFromEventPassIdDocument, variables, options) as Promise<Types.GetEventPassNftContractDelayedRevealedFromEventPassIdQuery>;
    },
    GetEventPassNftContractDelayedRevealPassword(variables?: Types.GetEventPassNftContractDelayedRevealPasswordQueryVariables, options?: C): Promise<Types.GetEventPassNftContractDelayedRevealPasswordQuery> {
      return requester<Types.GetEventPassNftContractDelayedRevealPasswordQuery, Types.GetEventPassNftContractDelayedRevealPasswordQueryVariables>(GetEventPassNftContractDelayedRevealPasswordDocument, variables, options) as Promise<Types.GetEventPassNftContractDelayedRevealPasswordQuery>;
    },
    GetEventPassNftContractNfts(variables?: Types.GetEventPassNftContractNftsQueryVariables, options?: C): Promise<Types.GetEventPassNftContractNftsQuery> {
      return requester<Types.GetEventPassNftContractNftsQuery, Types.GetEventPassNftContractNftsQueryVariables>(GetEventPassNftContractNftsDocument, variables, options) as Promise<Types.GetEventPassNftContractNftsQuery>;
    },
    GetEventPassOrderSums(variables: Types.GetEventPassOrderSumsQueryVariables, options?: C): Promise<Types.GetEventPassOrderSumsQuery> {
      return requester<Types.GetEventPassOrderSumsQuery, Types.GetEventPassOrderSumsQueryVariables>(GetEventPassOrderSumsDocument, variables, options) as Promise<Types.GetEventPassOrderSumsQuery>;
    },
    CreatePackNftContract(variables: Types.CreatePackNftContractMutationVariables, options?: C): Promise<Types.CreatePackNftContractMutation> {
      return requester<Types.CreatePackNftContractMutation, Types.CreatePackNftContractMutationVariables>(CreatePackNftContractDocument, variables, options) as Promise<Types.CreatePackNftContractMutation>;
    },
    GetPackNftContractFromPackId(variables?: Types.GetPackNftContractFromPackIdQueryVariables, options?: C): Promise<Types.GetPackNftContractFromPackIdQuery> {
      return requester<Types.GetPackNftContractFromPackIdQuery, Types.GetPackNftContractFromPackIdQueryVariables>(GetPackNftContractFromPackIdDocument, variables, options) as Promise<Types.GetPackNftContractFromPackIdQuery>;
    },
    CreatePassAmount(variables: Types.CreatePassAmountMutationVariables, options?: C): Promise<Types.CreatePassAmountMutation> {
      return requester<Types.CreatePassAmountMutation, Types.CreatePassAmountMutationVariables>(CreatePassAmountDocument, variables, options) as Promise<Types.CreatePassAmountMutation>;
    },
    UpdatePassAmount(variables: Types.UpdatePassAmountMutationVariables, options?: C): Promise<Types.UpdatePassAmountMutation> {
      return requester<Types.UpdatePassAmountMutation, Types.UpdatePassAmountMutationVariables>(UpdatePassAmountDocument, variables, options) as Promise<Types.UpdatePassAmountMutation>;
    },
    CreatePassPricing(variables: Types.CreatePassPricingMutationVariables, options?: C): Promise<Types.CreatePassPricingMutation> {
      return requester<Types.CreatePassPricingMutation, Types.CreatePassPricingMutationVariables>(CreatePassPricingDocument, variables, options) as Promise<Types.CreatePassPricingMutation>;
    },
    UpdatePassPricing(variables: Types.UpdatePassPricingMutationVariables, options?: C): Promise<Types.UpdatePassPricingMutation> {
      return requester<Types.UpdatePassPricingMutation, Types.UpdatePassPricingMutationVariables>(UpdatePassPricingDocument, variables, options) as Promise<Types.UpdatePassPricingMutation>;
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
    CreateEventParameters(variables: Types.CreateEventParametersMutationVariables, options?: C): Promise<Types.CreateEventParametersMutation> {
      return requester<Types.CreateEventParametersMutation, Types.CreateEventParametersMutationVariables>(CreateEventParametersDocument, variables, options) as Promise<Types.CreateEventParametersMutation>;
    },
    GetAlchemyInfosFromEventId(variables?: Types.GetAlchemyInfosFromEventIdQueryVariables, options?: C): Promise<Types.GetAlchemyInfosFromEventIdQuery> {
      return requester<Types.GetAlchemyInfosFromEventIdQuery, Types.GetAlchemyInfosFromEventIdQueryVariables>(GetAlchemyInfosFromEventIdDocument, variables, options) as Promise<Types.GetAlchemyInfosFromEventIdQuery>;
    },
    GetEventParameters(variables?: Types.GetEventParametersQueryVariables, options?: C): Promise<Types.GetEventParametersQuery> {
      return requester<Types.GetEventParametersQuery, Types.GetEventParametersQueryVariables>(GetEventParametersDocument, variables, options) as Promise<Types.GetEventParametersQuery>;
    },
    GetEventPassNftById(variables: Types.GetEventPassNftByIdQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdQuery> {
      return requester<Types.GetEventPassNftByIdQuery, Types.GetEventPassNftByIdQueryVariables>(GetEventPassNftByIdDocument, variables, options) as Promise<Types.GetEventPassNftByIdQuery>;
    },
    GetEventPassNftByIdMinimal(variables: Types.GetEventPassNftByIdMinimalQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdMinimalQuery> {
      return requester<Types.GetEventPassNftByIdMinimalQuery, Types.GetEventPassNftByIdMinimalQueryVariables>(GetEventPassNftByIdMinimalDocument, variables, options) as Promise<Types.GetEventPassNftByIdMinimalQuery>;
    },
    GetEventPassNftByIdWithEventPassNftContract(variables: Types.GetEventPassNftByIdWithEventPassNftContractQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdWithEventPassNftContractQuery> {
      return requester<Types.GetEventPassNftByIdWithEventPassNftContractQuery, Types.GetEventPassNftByIdWithEventPassNftContractQueryVariables>(GetEventPassNftByIdWithEventPassNftContractDocument, variables, options) as Promise<Types.GetEventPassNftByIdWithEventPassNftContractQuery>;
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