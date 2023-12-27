import * as Types from '@gql/user/types';

import { fetchData } from "@next/hasura/api";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  email
}
    `;
export const OrganizerFieldsFragmentDoc = `
    fragment OrganizerFields on Organizer {
  image {
    url
  }
  imageClasses
  name
  slug
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
  tokenId
  eventId
  eventPassId
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
      id
      slug
      name
      image {
        url
      }
      imageClasses
    }
    eventPasses {
      id
      name
      description
      passPricing {
        ...PassPricingFields
      }
      passAmount {
        ...PassAmountFields
      }
    }
  }
}
    ${PassPricingFieldsFragmentDoc}
${PassAmountFieldsFragmentDoc}`;
 const GetOrdersConfirmedDocument = `
    query GetOrdersConfirmed {
  order(where: {status: {_eq: CONFIRMED}}) {
    eventPassId
    quantity
  }
}
    `;
 const GetOrdersIsMintingDocument = `
    query GetOrdersIsMinting {
  order(where: {status: {_eq: IS_MINTING}}) {
    eventPassId
    quantity
  }
}
    `;
 const GetOrdersFromIdsDocument = `
    query GetOrdersFromIds($orderIds: [uuid!]!, $stage: Stage!) {
  order(where: {id: {_in: $orderIds}}) {
    eventPassId
    quantity
    eventPass(locales: [en], stage: $stage) {
      event {
        slug
        organizer {
          slug
        }
      }
    }
  }
}
    `;
 const GetOrderPurchasedForEventPassesIdDocument = `
    query GetOrderPurchasedForEventPassesId($eventPassId: String!) {
  order(
    where: {status: {_in: [CONFIRMED, COMPLETED, IS_MINTING]}, eventPassId: {_eq: $eventPassId}}
  ) {
    eventPassId
    quantity
  }
}
    `;
 const GetOrderPurchasedForEventPassesIdsDocument = `
    query GetOrderPurchasedForEventPassesIds($eventPassIds: [String!]!) {
  order(
    where: {status: {_in: [CONFIRMED, COMPLETED, IS_MINTING]}, eventPassId: {_in: $eventPassIds}}
  ) {
    eventPassId
    quantity
  }
}
    `;
 const UpsertEventPassPendingOrderDocument = `
    mutation UpsertEventPassPendingOrder($object: pendingOrder_insert_input!) {
  insert_pendingOrder_one(
    object: $object
    on_conflict: {constraint: idx_pendingorder_eventpassid_accountid, update_columns: [quantity]}
  ) {
    id
    quantity
    eventPassId
    created_at
  }
}
    `;
 const UpsertEventPassPendingOrdersDocument = `
    mutation UpsertEventPassPendingOrders($objects: [pendingOrder_insert_input!]!, $stage: Stage!) {
  insert_pendingOrder(
    objects: $objects
    on_conflict: {constraint: idx_pendingorder_eventpassid_accountid, update_columns: [quantity]}
  ) {
    returning {
      id
      eventPassId
      quantity
      created_at
      passAmount {
        timeBeforeDelete
      }
      eventPass(locales: [en], stage: $stage) {
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
 const UpsertPackPendingOrderDocument = `
    mutation UpsertPackPendingOrder($object: pendingOrder_insert_input!) {
  insert_pendingOrder_one(
    object: $object
    on_conflict: {constraint: idx_pendingorder_packid_accountid, update_columns: [quantity]}
  ) {
    id
    quantity
    packId
    created_at
  }
}
    `;
 const UpsertPackPendingOrdersDocument = `
    mutation UpsertPackPendingOrders($objects: [pendingOrder_insert_input!]!, $stage: Stage!) {
  insert_pendingOrder(
    objects: $objects
    on_conflict: {constraint: idx_pendingorder_packid_accountid, update_columns: [quantity]}
  ) {
    returning {
      id
      packId
      quantity
      created_at
      packAmount {
        timeBeforeDelete
      }
      pack(locales: [en], stage: $stage) {
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
 const DeletePendingOrderDocument = `
    mutation DeletePendingOrder($pendingOrderId: uuid!) {
  delete_pendingOrder_by_pk(id: $pendingOrderId) {
    id
  }
}
    `;
 const DeletePendingOrdersDocument = `
    mutation DeletePendingOrders($eventPassIds: [String!]!) {
  delete_pendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    affected_rows
  }
}
    `;
 const DeleteAllPendingOrdersDocument = `
    mutation DeleteAllPendingOrders {
  delete_pendingOrder(where: {}) {
    affected_rows
  }
}
    `;
 const GetPendingOrderForEventPassDocument = `
    query GetPendingOrderForEventPass($eventPassId: String!) {
  pendingOrder(where: {eventPassId: {_eq: $eventPassId}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;
 const GetPendingOrderForEventPassesDocument = `
    query GetPendingOrderForEventPasses($eventPassIds: [String!]) {
  pendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;
 const GetPendingOrdersDocument = `
    query GetPendingOrders($stage: Stage!) {
  pendingOrder {
    id
    eventPassId
    packId
    quantity
    created_at
    passAmount {
      timeBeforeDelete
    }
    packAmount {
      timeBeforeDelete
    }
    eventPass(locales: [en], stage: $stage) {
      event {
        slug
        organizer {
          slug
        }
      }
    }
    pack(locales: [en], stage: $stage) {
      event {
        slug
        organizer {
          slug
        }
      }
    }
  }
}
    `;
 const GetPendingOrdersMinimalDocument = `
    query GetPendingOrdersMinimal {
  pendingOrder {
    eventPassId
    packId
    quantity
  }
}
    `;
 const GetKycDocument = `
    query GetKyc {
  kyc {
    applicantId
    reviewStatus
    levelName
  }
}
    `;
 const InsertFollowOrganizerDocument = `
    mutation InsertFollowOrganizer($organizerSlug: String!) {
  insert_follow_one(object: {organizerSlug: $organizerSlug}) {
    organizerSlug
  }
}
    `;
 const GetPassedEventsWithEventPassNftsDocument = `
    query GetPassedEventsWithEventPassNfts($address: String!, $currentDate: timestamp!, $locale: Locale!, $stage: Stage!) {
  eventParameters(
    where: {eventPassNfts: {currentOwnerAddress: {_eq: $address}}, dateEnd: {_lt: $currentDate}}
    order_by: {dateEnd: desc}
  ) {
    dateStart
    dateEnd
    timezone
    eventPassNftContracts(
      where: {eventPassNfts: {currentOwnerAddress: {_eq: $address}}}
    ) {
      type
      isDelayedRevealed
      eventPass(locales: [$locale, en], stage: $stage) {
        id
        name
        event {
          slug
        }
        nftImage {
          url
        }
      }
      eventPassNfts(where: {currentOwnerAddress: {_eq: $address}}) {
        id
        isRevealed
        tokenId
      }
    }
    organizer(where: {}, locales: [$locale, en], stage: $stage) {
      id
      slug
      name
      image {
        url
      }
      imageClasses
    }
    event(where: {}, locales: [$locale, en], stage: $stage) {
      id
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
 const GetUpcomingEventsWithEventPassNftsDocument = `
    query GetUpcomingEventsWithEventPassNfts($address: String!, $currentDate: timestamp!, $locale: Locale!, $stage: Stage!) {
  eventParameters(
    where: {eventPassNfts: {currentOwnerAddress: {_eq: $address}}, dateEnd: {_gte: $currentDate}}
    order_by: {dateStart: asc}
  ) {
    dateStart
    dateEnd
    timezone
    eventPassNftContracts(
      where: {eventPassNfts: {currentOwnerAddress: {_eq: $address}}}
    ) {
      type
      isDelayedRevealed
      eventPass(locales: [$locale, en], stage: $stage) {
        id
        name
        event {
          slug
        }
        nftImage {
          url
        }
      }
      eventPassNfts(where: {currentOwnerAddress: {_eq: $address}}) {
        id
        isRevealed
        tokenId
      }
    }
    organizer(where: {}, locales: [$locale, en], stage: $stage) {
      id
      slug
      name
      image {
        url
      }
      imageClasses
    }
    event(where: {}, locales: [$locale, en], stage: $stage) {
      id
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
 const GetEventPassNftByTokenReferenceDocument = `
    query GetEventPassNftByTokenReference($organizerId: String!, $eventId: String!, $eventPassId: String!, $tokenId: bigint!, $chainId: String!, $locale: Locale!, $stage: Stage!) @cached {
  eventPassNft(
    where: {organizerId: {_eq: $organizerId}, eventId: {_eq: $eventId}, eventPassId: {_eq: $eventPassId}, tokenId: {_eq: $tokenId}, chainId: {_eq: $chainId}}
  ) {
    ...EventPassNftFields
    eventPass(locales: [$locale, en], stage: $stage) {
      ...EventPassFields
    }
  }
}
    ${EventPassNftFieldsFragmentDoc}
${EventPassFieldsFragmentDoc}`;
 const GetMyRolesDocument = `
    query GetMyRoles {
  roleAssignment {
    ...RoleAssignmentFields
  }
}
    ${RoleAssignmentFieldsFragmentDoc}`;
 const GetMyRolesWithOrganizerInfosDocument = `
    query GetMyRolesWithOrganizerInfos($stage: Stage!) {
  roleAssignment {
    ...RoleAssignmentFields
    organizer(where: {}, locales: [en], stage: $stage) {
      ...OrganizerFields
    }
  }
}
    ${RoleAssignmentFieldsFragmentDoc}
${OrganizerFieldsFragmentDoc}`;
 const GetMyRolesWithOrganizerAndInviterInfosDocument = `
    query GetMyRolesWithOrganizerAndInviterInfos($stage: Stage!) {
  roleAssignment {
    ...RoleAssignmentFields
    organizer(where: {}, locales: [en], stage: $stage) {
      ...OrganizerFields
    }
    inviter {
      address
      email
    }
  }
}
    ${RoleAssignmentFieldsFragmentDoc}
${OrganizerFieldsFragmentDoc}`;
 const GetStripeCustomerDocument = `
    query GetStripeCustomer {
  stripeCustomer {
    stripeCustomerId
    accountId
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: string, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetAccount(variables: Types.GetAccountQueryVariables, options?: C): Promise<Types.GetAccountQuery> {
      return requester<Types.GetAccountQuery, Types.GetAccountQueryVariables>(GetAccountDocument, variables, options) as Promise<Types.GetAccountQuery>;
    },
    GetAccountByEmail(variables: Types.GetAccountByEmailQueryVariables, options?: C): Promise<Types.GetAccountByEmailQuery> {
      return requester<Types.GetAccountByEmailQuery, Types.GetAccountByEmailQueryVariables>(GetAccountByEmailDocument, variables, options) as Promise<Types.GetAccountByEmailQuery>;
    },
    GetEventWithPasses(variables: Types.GetEventWithPassesQueryVariables, options?: C): Promise<Types.GetEventWithPassesQuery> {
      return requester<Types.GetEventWithPassesQuery, Types.GetEventWithPassesQueryVariables>(GetEventWithPassesDocument, variables, options) as Promise<Types.GetEventWithPassesQuery>;
    },
    GetOrdersConfirmed(variables?: Types.GetOrdersConfirmedQueryVariables, options?: C): Promise<Types.GetOrdersConfirmedQuery> {
      return requester<Types.GetOrdersConfirmedQuery, Types.GetOrdersConfirmedQueryVariables>(GetOrdersConfirmedDocument, variables, options) as Promise<Types.GetOrdersConfirmedQuery>;
    },
    GetOrdersIsMinting(variables?: Types.GetOrdersIsMintingQueryVariables, options?: C): Promise<Types.GetOrdersIsMintingQuery> {
      return requester<Types.GetOrdersIsMintingQuery, Types.GetOrdersIsMintingQueryVariables>(GetOrdersIsMintingDocument, variables, options) as Promise<Types.GetOrdersIsMintingQuery>;
    },
    GetOrdersFromIds(variables: Types.GetOrdersFromIdsQueryVariables, options?: C): Promise<Types.GetOrdersFromIdsQuery> {
      return requester<Types.GetOrdersFromIdsQuery, Types.GetOrdersFromIdsQueryVariables>(GetOrdersFromIdsDocument, variables, options) as Promise<Types.GetOrdersFromIdsQuery>;
    },
    GetOrderPurchasedForEventPassesId(variables: Types.GetOrderPurchasedForEventPassesIdQueryVariables, options?: C): Promise<Types.GetOrderPurchasedForEventPassesIdQuery> {
      return requester<Types.GetOrderPurchasedForEventPassesIdQuery, Types.GetOrderPurchasedForEventPassesIdQueryVariables>(GetOrderPurchasedForEventPassesIdDocument, variables, options) as Promise<Types.GetOrderPurchasedForEventPassesIdQuery>;
    },
    GetOrderPurchasedForEventPassesIds(variables: Types.GetOrderPurchasedForEventPassesIdsQueryVariables, options?: C): Promise<Types.GetOrderPurchasedForEventPassesIdsQuery> {
      return requester<Types.GetOrderPurchasedForEventPassesIdsQuery, Types.GetOrderPurchasedForEventPassesIdsQueryVariables>(GetOrderPurchasedForEventPassesIdsDocument, variables, options) as Promise<Types.GetOrderPurchasedForEventPassesIdsQuery>;
    },
    UpsertEventPassPendingOrder(variables: Types.UpsertEventPassPendingOrderMutationVariables, options?: C): Promise<Types.UpsertEventPassPendingOrderMutation> {
      return requester<Types.UpsertEventPassPendingOrderMutation, Types.UpsertEventPassPendingOrderMutationVariables>(UpsertEventPassPendingOrderDocument, variables, options) as Promise<Types.UpsertEventPassPendingOrderMutation>;
    },
    UpsertEventPassPendingOrders(variables: Types.UpsertEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.UpsertEventPassPendingOrdersMutation> {
      return requester<Types.UpsertEventPassPendingOrdersMutation, Types.UpsertEventPassPendingOrdersMutationVariables>(UpsertEventPassPendingOrdersDocument, variables, options) as Promise<Types.UpsertEventPassPendingOrdersMutation>;
    },
    UpsertPackPendingOrder(variables: Types.UpsertPackPendingOrderMutationVariables, options?: C): Promise<Types.UpsertPackPendingOrderMutation> {
      return requester<Types.UpsertPackPendingOrderMutation, Types.UpsertPackPendingOrderMutationVariables>(UpsertPackPendingOrderDocument, variables, options) as Promise<Types.UpsertPackPendingOrderMutation>;
    },
    UpsertPackPendingOrders(variables: Types.UpsertPackPendingOrdersMutationVariables, options?: C): Promise<Types.UpsertPackPendingOrdersMutation> {
      return requester<Types.UpsertPackPendingOrdersMutation, Types.UpsertPackPendingOrdersMutationVariables>(UpsertPackPendingOrdersDocument, variables, options) as Promise<Types.UpsertPackPendingOrdersMutation>;
    },
    DeletePendingOrder(variables: Types.DeletePendingOrderMutationVariables, options?: C): Promise<Types.DeletePendingOrderMutation> {
      return requester<Types.DeletePendingOrderMutation, Types.DeletePendingOrderMutationVariables>(DeletePendingOrderDocument, variables, options) as Promise<Types.DeletePendingOrderMutation>;
    },
    DeletePendingOrders(variables: Types.DeletePendingOrdersMutationVariables, options?: C): Promise<Types.DeletePendingOrdersMutation> {
      return requester<Types.DeletePendingOrdersMutation, Types.DeletePendingOrdersMutationVariables>(DeletePendingOrdersDocument, variables, options) as Promise<Types.DeletePendingOrdersMutation>;
    },
    DeleteAllPendingOrders(variables?: Types.DeleteAllPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteAllPendingOrdersMutation> {
      return requester<Types.DeleteAllPendingOrdersMutation, Types.DeleteAllPendingOrdersMutationVariables>(DeleteAllPendingOrdersDocument, variables, options) as Promise<Types.DeleteAllPendingOrdersMutation>;
    },
    GetPendingOrderForEventPass(variables: Types.GetPendingOrderForEventPassQueryVariables, options?: C): Promise<Types.GetPendingOrderForEventPassQuery> {
      return requester<Types.GetPendingOrderForEventPassQuery, Types.GetPendingOrderForEventPassQueryVariables>(GetPendingOrderForEventPassDocument, variables, options) as Promise<Types.GetPendingOrderForEventPassQuery>;
    },
    GetPendingOrderForEventPasses(variables?: Types.GetPendingOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetPendingOrderForEventPassesQuery> {
      return requester<Types.GetPendingOrderForEventPassesQuery, Types.GetPendingOrderForEventPassesQueryVariables>(GetPendingOrderForEventPassesDocument, variables, options) as Promise<Types.GetPendingOrderForEventPassesQuery>;
    },
    GetPendingOrders(variables: Types.GetPendingOrdersQueryVariables, options?: C): Promise<Types.GetPendingOrdersQuery> {
      return requester<Types.GetPendingOrdersQuery, Types.GetPendingOrdersQueryVariables>(GetPendingOrdersDocument, variables, options) as Promise<Types.GetPendingOrdersQuery>;
    },
    GetPendingOrdersMinimal(variables?: Types.GetPendingOrdersMinimalQueryVariables, options?: C): Promise<Types.GetPendingOrdersMinimalQuery> {
      return requester<Types.GetPendingOrdersMinimalQuery, Types.GetPendingOrdersMinimalQueryVariables>(GetPendingOrdersMinimalDocument, variables, options) as Promise<Types.GetPendingOrdersMinimalQuery>;
    },
    GetKyc(variables?: Types.GetKycQueryVariables, options?: C): Promise<Types.GetKycQuery> {
      return requester<Types.GetKycQuery, Types.GetKycQueryVariables>(GetKycDocument, variables, options) as Promise<Types.GetKycQuery>;
    },
    InsertFollowOrganizer(variables: Types.InsertFollowOrganizerMutationVariables, options?: C): Promise<Types.InsertFollowOrganizerMutation> {
      return requester<Types.InsertFollowOrganizerMutation, Types.InsertFollowOrganizerMutationVariables>(InsertFollowOrganizerDocument, variables, options) as Promise<Types.InsertFollowOrganizerMutation>;
    },
    GetPassedEventsWithEventPassNfts(variables: Types.GetPassedEventsWithEventPassNftsQueryVariables, options?: C): Promise<Types.GetPassedEventsWithEventPassNftsQuery> {
      return requester<Types.GetPassedEventsWithEventPassNftsQuery, Types.GetPassedEventsWithEventPassNftsQueryVariables>(GetPassedEventsWithEventPassNftsDocument, variables, options) as Promise<Types.GetPassedEventsWithEventPassNftsQuery>;
    },
    GetUpcomingEventsWithEventPassNfts(variables: Types.GetUpcomingEventsWithEventPassNftsQueryVariables, options?: C): Promise<Types.GetUpcomingEventsWithEventPassNftsQuery> {
      return requester<Types.GetUpcomingEventsWithEventPassNftsQuery, Types.GetUpcomingEventsWithEventPassNftsQueryVariables>(GetUpcomingEventsWithEventPassNftsDocument, variables, options) as Promise<Types.GetUpcomingEventsWithEventPassNftsQuery>;
    },
    GetEventPassNftByTokenReference(variables: Types.GetEventPassNftByTokenReferenceQueryVariables, options?: C): Promise<Types.GetEventPassNftByTokenReferenceQuery> {
      return requester<Types.GetEventPassNftByTokenReferenceQuery, Types.GetEventPassNftByTokenReferenceQueryVariables>(GetEventPassNftByTokenReferenceDocument, variables, options) as Promise<Types.GetEventPassNftByTokenReferenceQuery>;
    },
    GetMyRoles(variables?: Types.GetMyRolesQueryVariables, options?: C): Promise<Types.GetMyRolesQuery> {
      return requester<Types.GetMyRolesQuery, Types.GetMyRolesQueryVariables>(GetMyRolesDocument, variables, options) as Promise<Types.GetMyRolesQuery>;
    },
    GetMyRolesWithOrganizerInfos(variables: Types.GetMyRolesWithOrganizerInfosQueryVariables, options?: C): Promise<Types.GetMyRolesWithOrganizerInfosQuery> {
      return requester<Types.GetMyRolesWithOrganizerInfosQuery, Types.GetMyRolesWithOrganizerInfosQueryVariables>(GetMyRolesWithOrganizerInfosDocument, variables, options) as Promise<Types.GetMyRolesWithOrganizerInfosQuery>;
    },
    GetMyRolesWithOrganizerAndInviterInfos(variables: Types.GetMyRolesWithOrganizerAndInviterInfosQueryVariables, options?: C): Promise<Types.GetMyRolesWithOrganizerAndInviterInfosQuery> {
      return requester<Types.GetMyRolesWithOrganizerAndInviterInfosQuery, Types.GetMyRolesWithOrganizerAndInviterInfosQueryVariables>(GetMyRolesWithOrganizerAndInviterInfosDocument, variables, options) as Promise<Types.GetMyRolesWithOrganizerAndInviterInfosQuery>;
    },
    GetStripeCustomer(variables?: Types.GetStripeCustomerQueryVariables, options?: C): Promise<Types.GetStripeCustomerQuery> {
      return requester<Types.GetStripeCustomerQuery, Types.GetStripeCustomerQueryVariables>(GetStripeCustomerDocument, variables, options) as Promise<Types.GetStripeCustomerQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const userSdk = getSdk(fetchData());