import * as Types from '@gql/user/types';

import { fetchData } from "@next/hasura/api";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  email
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
  tokenId
  eventId
  eventPassId
  organizerId
  isRevealed
  currentOwnerAddress
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
    organizer {
      id
      slug
      name
      image {
        url
      }
    }
    eventPasses {
      id
      name
      description
      eventPassPricing {
        priceAmount
        priceCurrency
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
 const GetEventPassOrdersConfirmedOrCompletedForEventPassIdDocument = `
    query GetEventPassOrdersConfirmedOrCompletedForEventPassId($eventPassId: String!) {
  eventPassOrder(
    where: {status: {_in: [CONFIRMED, COMPLETED]}, eventPassId: {_eq: $eventPassId}}
  ) {
    eventPassId
    quantity
  }
}
    `;
 const GetEventPassOrdersConfirmedOrCompletedForEventPassIdsDocument = `
    query GetEventPassOrdersConfirmedOrCompletedForEventPassIds($eventPassIds: [String!]!) {
  eventPassOrder(
    where: {status: {_in: [CONFIRMED, COMPLETED]}, eventPassId: {_in: $eventPassIds}}
  ) {
    eventPassId
    quantity
  }
}
    `;
 const InsertEventPassPendingOrdersDocument = `
    mutation InsertEventPassPendingOrders($objects: [eventPassPendingOrder_insert_input!]!) {
  insert_eventPassPendingOrder(objects: $objects) {
    returning {
      id
      quantity
      eventPassId
      created_at
    }
  }
}
    `;
 const UpsertEventPassPendingOrderDocument = `
    mutation UpsertEventPassPendingOrder($object: eventPassPendingOrder_insert_input!) {
  insert_eventPassPendingOrder_one(
    object: $object
    on_conflict: {constraint: eventPassPendingOrder_pkey, update_columns: [quantity]}
  ) {
    id
    quantity
    eventPassId
    created_at
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
    query GetEventPassPendingOrders($locale: Locale!, $stage: Stage!) {
  eventPassPendingOrder {
    id
    eventPassId
    quantity
    created_at
    eventPass(locales: [$locale, en], stage: $stage) {
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
    }
    event(where: {}, locales: [$locale, en], stage: $stage) {
      id
      slug
      title
      heroImage {
        url
      }
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
    }
    event(where: {}, locales: [$locale, en], stage: $stage) {
      id
      slug
      title
      heroImage {
        url
      }
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
    GetEventPassOrdersConfirmedOrCompletedForEventPassId(variables: Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQueryVariables, options?: C): Promise<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery> {
      return requester<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery, Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQueryVariables>(GetEventPassOrdersConfirmedOrCompletedForEventPassIdDocument, variables, options) as Promise<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery>;
    },
    GetEventPassOrdersConfirmedOrCompletedForEventPassIds(variables: Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQueryVariables, options?: C): Promise<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery> {
      return requester<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery, Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQueryVariables>(GetEventPassOrdersConfirmedOrCompletedForEventPassIdsDocument, variables, options) as Promise<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery>;
    },
    InsertEventPassPendingOrders(variables: Types.InsertEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.InsertEventPassPendingOrdersMutation> {
      return requester<Types.InsertEventPassPendingOrdersMutation, Types.InsertEventPassPendingOrdersMutationVariables>(InsertEventPassPendingOrdersDocument, variables, options) as Promise<Types.InsertEventPassPendingOrdersMutation>;
    },
    UpsertEventPassPendingOrder(variables: Types.UpsertEventPassPendingOrderMutationVariables, options?: C): Promise<Types.UpsertEventPassPendingOrderMutation> {
      return requester<Types.UpsertEventPassPendingOrderMutation, Types.UpsertEventPassPendingOrderMutationVariables>(UpsertEventPassPendingOrderDocument, variables, options) as Promise<Types.UpsertEventPassPendingOrderMutation>;
    },
    DeleteEventPassPendingOrder(variables: Types.DeleteEventPassPendingOrderMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrderMutation> {
      return requester<Types.DeleteEventPassPendingOrderMutation, Types.DeleteEventPassPendingOrderMutationVariables>(DeleteEventPassPendingOrderDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrderMutation>;
    },
    DeleteEventPassPendingOrders(variables: Types.DeleteEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrdersMutation> {
      return requester<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrdersMutation>;
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
    GetPassedEventsWithEventPassNfts(variables: Types.GetPassedEventsWithEventPassNftsQueryVariables, options?: C): Promise<Types.GetPassedEventsWithEventPassNftsQuery> {
      return requester<Types.GetPassedEventsWithEventPassNftsQuery, Types.GetPassedEventsWithEventPassNftsQueryVariables>(GetPassedEventsWithEventPassNftsDocument, variables, options) as Promise<Types.GetPassedEventsWithEventPassNftsQuery>;
    },
    GetUpcomingEventsWithEventPassNfts(variables: Types.GetUpcomingEventsWithEventPassNftsQueryVariables, options?: C): Promise<Types.GetUpcomingEventsWithEventPassNftsQuery> {
      return requester<Types.GetUpcomingEventsWithEventPassNftsQuery, Types.GetUpcomingEventsWithEventPassNftsQueryVariables>(GetUpcomingEventsWithEventPassNftsDocument, variables, options) as Promise<Types.GetUpcomingEventsWithEventPassNftsQuery>;
    },
    GetEventPassNftByTokenReference(variables: Types.GetEventPassNftByTokenReferenceQueryVariables, options?: C): Promise<Types.GetEventPassNftByTokenReferenceQuery> {
      return requester<Types.GetEventPassNftByTokenReferenceQuery, Types.GetEventPassNftByTokenReferenceQueryVariables>(GetEventPassNftByTokenReferenceDocument, variables, options) as Promise<Types.GetEventPassNftByTokenReferenceQuery>;
    },
    GetStripeCustomer(variables?: Types.GetStripeCustomerQueryVariables, options?: C): Promise<Types.GetStripeCustomerQuery> {
      return requester<Types.GetStripeCustomerQuery, Types.GetStripeCustomerQueryVariables>(GetStripeCustomerDocument, variables, options) as Promise<Types.GetStripeCustomerQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const userSdk = getSdk(fetchData());