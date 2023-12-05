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
      eventPassPricing {
        priceAmount
        priceCurrency
        timeBeforeDelete
      }
    }
  }
}
    `;
 const GetEventPassOrdersConfirmedDocument = `
    query GetEventPassOrdersConfirmed {
  eventPassOrder(where: {status: {_eq: CONFIRMED}}) {
    eventPassId
    quantity
  }
}
    `;
 const GetEventPassOrdersIsMintingDocument = `
    query GetEventPassOrdersIsMinting {
  eventPassOrder(where: {status: {_eq: IS_MINTING}}) {
    eventPassId
    quantity
  }
}
    `;
 const GetEventPassOrdersFromIdsDocument = `
    query GetEventPassOrdersFromIds($eventPassOrderIds: [uuid!]!, $stage: Stage!) {
  eventPassOrder(where: {id: {_in: $eventPassOrderIds}}) {
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
 const GetEventPassOrderPurchasedForEventPassesIdDocument = `
    query GetEventPassOrderPurchasedForEventPassesId($eventPassId: String!) {
  eventPassOrder(
    where: {status: {_in: [CONFIRMED, COMPLETED, IS_MINTING]}, eventPassId: {_eq: $eventPassId}}
  ) {
    eventPassId
    quantity
  }
}
    `;
 const GetEventPassOrderPurchasedForEventPassesIdsDocument = `
    query GetEventPassOrderPurchasedForEventPassesIds($eventPassIds: [String!]!) {
  eventPassOrder(
    where: {status: {_in: [CONFIRMED, COMPLETED, IS_MINTING]}, eventPassId: {_in: $eventPassIds}}
  ) {
    eventPassId
    quantity
  }
}
    `;
 const UpsertEventPassPendingOrderDocument = `
    mutation UpsertEventPassPendingOrder($object: eventPassPendingOrder_insert_input!) {
  insert_eventPassPendingOrder_one(
    object: $object
    on_conflict: {constraint: eventPassPendingOrder_eventPassId_accountId_key, update_columns: [quantity]}
  ) {
    id
    quantity
    eventPassId
    created_at
  }
}
    `;
 const UpsertEventPassPendingOrdersDocument = `
    mutation UpsertEventPassPendingOrders($objects: [eventPassPendingOrder_insert_input!]!, $stage: Stage!) {
  insert_eventPassPendingOrder(
    objects: $objects
    on_conflict: {constraint: eventPassPendingOrder_eventPassId_accountId_key, update_columns: [quantity]}
  ) {
    returning {
      id
      eventPassId
      quantity
      created_at
      eventPassPricing {
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
 const DeleteEventPassPendingOrderDocument = `
    mutation DeleteEventPassPendingOrder($eventPassPendingOrderId: uuid!) {
  delete_eventPassPendingOrder_by_pk(id: $eventPassPendingOrderId) {
    id
  }
}
    `;
 const DeleteEventPassPendingOrdersDocument = `
    mutation DeleteEventPassPendingOrders($eventPassIds: [String!]!) {
  delete_eventPassPendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    affected_rows
  }
}
    `;
 const DeleteAllEventPassPendingOrdersDocument = `
    mutation DeleteAllEventPassPendingOrders {
  delete_eventPassPendingOrder(where: {}) {
    affected_rows
  }
}
    `;
 const GetEventPassPendingOrderForEventPassDocument = `
    query GetEventPassPendingOrderForEventPass($eventPassId: String!) {
  eventPassPendingOrder(where: {eventPassId: {_eq: $eventPassId}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;
 const GetEventPassPendingOrderForEventPassesDocument = `
    query GetEventPassPendingOrderForEventPasses($eventPassIds: [String!]) {
  eventPassPendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;
 const GetEventPassPendingOrdersDocument = `
    query GetEventPassPendingOrders($stage: Stage!) {
  eventPassPendingOrder {
    id
    eventPassId
    quantity
    created_at
    eventPassPricing {
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
    `;
 const GetEventPassPendingOrdersMinimalDocument = `
    query GetEventPassPendingOrdersMinimal {
  eventPassPendingOrder {
    eventPassId
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
  roleAssignments {
    ...RoleAssignmentsFields
  }
}
    ${RoleAssignmentsFieldsFragmentDoc}`;
 const GetMyRolesWithOrganizerInfosDocument = `
    query GetMyRolesWithOrganizerInfos($stage: Stage!) {
  roleAssignments {
    ...RoleAssignmentsFields
    organizer(where: {}, locales: [en], stage: $stage) {
      ...OrganizerFields
    }
  }
}
    ${RoleAssignmentsFieldsFragmentDoc}
${OrganizerFieldsFragmentDoc}`;
 const GetMyRolesWithOrganizerAndInviterInfosDocument = `
    query GetMyRolesWithOrganizerAndInviterInfos($stage: Stage!) {
  roleAssignments {
    ...RoleAssignmentsFields
    organizer(where: {}, locales: [en], stage: $stage) {
      ...OrganizerFields
    }
    inviter {
      address
      email
    }
  }
}
    ${RoleAssignmentsFieldsFragmentDoc}
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
    GetEventPassOrdersConfirmed(variables?: Types.GetEventPassOrdersConfirmedQueryVariables, options?: C): Promise<Types.GetEventPassOrdersConfirmedQuery> {
      return requester<Types.GetEventPassOrdersConfirmedQuery, Types.GetEventPassOrdersConfirmedQueryVariables>(GetEventPassOrdersConfirmedDocument, variables, options) as Promise<Types.GetEventPassOrdersConfirmedQuery>;
    },
    GetEventPassOrdersIsMinting(variables?: Types.GetEventPassOrdersIsMintingQueryVariables, options?: C): Promise<Types.GetEventPassOrdersIsMintingQuery> {
      return requester<Types.GetEventPassOrdersIsMintingQuery, Types.GetEventPassOrdersIsMintingQueryVariables>(GetEventPassOrdersIsMintingDocument, variables, options) as Promise<Types.GetEventPassOrdersIsMintingQuery>;
    },
    GetEventPassOrdersFromIds(variables: Types.GetEventPassOrdersFromIdsQueryVariables, options?: C): Promise<Types.GetEventPassOrdersFromIdsQuery> {
      return requester<Types.GetEventPassOrdersFromIdsQuery, Types.GetEventPassOrdersFromIdsQueryVariables>(GetEventPassOrdersFromIdsDocument, variables, options) as Promise<Types.GetEventPassOrdersFromIdsQuery>;
    },
    GetEventPassOrderPurchasedForEventPassesId(variables: Types.GetEventPassOrderPurchasedForEventPassesIdQueryVariables, options?: C): Promise<Types.GetEventPassOrderPurchasedForEventPassesIdQuery> {
      return requester<Types.GetEventPassOrderPurchasedForEventPassesIdQuery, Types.GetEventPassOrderPurchasedForEventPassesIdQueryVariables>(GetEventPassOrderPurchasedForEventPassesIdDocument, variables, options) as Promise<Types.GetEventPassOrderPurchasedForEventPassesIdQuery>;
    },
    GetEventPassOrderPurchasedForEventPassesIds(variables: Types.GetEventPassOrderPurchasedForEventPassesIdsQueryVariables, options?: C): Promise<Types.GetEventPassOrderPurchasedForEventPassesIdsQuery> {
      return requester<Types.GetEventPassOrderPurchasedForEventPassesIdsQuery, Types.GetEventPassOrderPurchasedForEventPassesIdsQueryVariables>(GetEventPassOrderPurchasedForEventPassesIdsDocument, variables, options) as Promise<Types.GetEventPassOrderPurchasedForEventPassesIdsQuery>;
    },
    UpsertEventPassPendingOrder(variables: Types.UpsertEventPassPendingOrderMutationVariables, options?: C): Promise<Types.UpsertEventPassPendingOrderMutation> {
      return requester<Types.UpsertEventPassPendingOrderMutation, Types.UpsertEventPassPendingOrderMutationVariables>(UpsertEventPassPendingOrderDocument, variables, options) as Promise<Types.UpsertEventPassPendingOrderMutation>;
    },
    UpsertEventPassPendingOrders(variables: Types.UpsertEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.UpsertEventPassPendingOrdersMutation> {
      return requester<Types.UpsertEventPassPendingOrdersMutation, Types.UpsertEventPassPendingOrdersMutationVariables>(UpsertEventPassPendingOrdersDocument, variables, options) as Promise<Types.UpsertEventPassPendingOrdersMutation>;
    },
    DeleteEventPassPendingOrder(variables: Types.DeleteEventPassPendingOrderMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrderMutation> {
      return requester<Types.DeleteEventPassPendingOrderMutation, Types.DeleteEventPassPendingOrderMutationVariables>(DeleteEventPassPendingOrderDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrderMutation>;
    },
    DeleteEventPassPendingOrders(variables: Types.DeleteEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrdersMutation> {
      return requester<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrdersMutation>;
    },
    DeleteAllEventPassPendingOrders(variables?: Types.DeleteAllEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteAllEventPassPendingOrdersMutation> {
      return requester<Types.DeleteAllEventPassPendingOrdersMutation, Types.DeleteAllEventPassPendingOrdersMutationVariables>(DeleteAllEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteAllEventPassPendingOrdersMutation>;
    },
    GetEventPassPendingOrderForEventPass(variables: Types.GetEventPassPendingOrderForEventPassQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrderForEventPassQuery> {
      return requester<Types.GetEventPassPendingOrderForEventPassQuery, Types.GetEventPassPendingOrderForEventPassQueryVariables>(GetEventPassPendingOrderForEventPassDocument, variables, options) as Promise<Types.GetEventPassPendingOrderForEventPassQuery>;
    },
    GetEventPassPendingOrderForEventPasses(variables?: Types.GetEventPassPendingOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrderForEventPassesQuery> {
      return requester<Types.GetEventPassPendingOrderForEventPassesQuery, Types.GetEventPassPendingOrderForEventPassesQueryVariables>(GetEventPassPendingOrderForEventPassesDocument, variables, options) as Promise<Types.GetEventPassPendingOrderForEventPassesQuery>;
    },
    GetEventPassPendingOrders(variables: Types.GetEventPassPendingOrdersQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrdersQuery> {
      return requester<Types.GetEventPassPendingOrdersQuery, Types.GetEventPassPendingOrdersQueryVariables>(GetEventPassPendingOrdersDocument, variables, options) as Promise<Types.GetEventPassPendingOrdersQuery>;
    },
    GetEventPassPendingOrdersMinimal(variables?: Types.GetEventPassPendingOrdersMinimalQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrdersMinimalQuery> {
      return requester<Types.GetEventPassPendingOrdersMinimalQuery, Types.GetEventPassPendingOrdersMinimalQueryVariables>(GetEventPassPendingOrdersMinimalDocument, variables, options) as Promise<Types.GetEventPassPendingOrdersMinimalQuery>;
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