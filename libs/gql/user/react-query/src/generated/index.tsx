import * as Types from '@gql/user/types';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { fetchDataReactQuery } from '@next/hasura/react-query';
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
export const GetAccountDocument = `
    query GetAccount($address: String!) {
  account(where: {address: {_eq: $address}}) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
export const useGetAccountQuery = <
      TData = Types.GetAccountQuery,
      TError = Error
    >(
      variables: Types.GetAccountQueryVariables,
      options?: UseQueryOptions<Types.GetAccountQuery, TError, TData>
    ) =>
    useQuery<Types.GetAccountQuery, TError, TData>(
      ['GetAccount', variables],
      fetchDataReactQuery<Types.GetAccountQuery, Types.GetAccountQueryVariables>(GetAccountDocument, variables),
      options
    );
export const GetAccountByEmailDocument = `
    query GetAccountByEmail($email: String!) {
  account(where: {email: {_eq: $email}}) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;
export const useGetAccountByEmailQuery = <
      TData = Types.GetAccountByEmailQuery,
      TError = Error
    >(
      variables: Types.GetAccountByEmailQueryVariables,
      options?: UseQueryOptions<Types.GetAccountByEmailQuery, TError, TData>
    ) =>
    useQuery<Types.GetAccountByEmailQuery, TError, TData>(
      ['GetAccountByEmail', variables],
      fetchDataReactQuery<Types.GetAccountByEmailQuery, Types.GetAccountByEmailQueryVariables>(GetAccountByEmailDocument, variables),
      options
    );
export const GetEventWithPassesDocument = `
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
export const useGetEventWithPassesQuery = <
      TData = Types.GetEventWithPassesQuery,
      TError = Error
    >(
      variables: Types.GetEventWithPassesQueryVariables,
      options?: UseQueryOptions<Types.GetEventWithPassesQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventWithPassesQuery, TError, TData>(
      ['GetEventWithPasses', variables],
      fetchDataReactQuery<Types.GetEventWithPassesQuery, Types.GetEventWithPassesQueryVariables>(GetEventWithPassesDocument, variables),
      options
    );
export const GetEventPassOrdersConfirmedDocument = `
    query GetEventPassOrdersConfirmed {
  eventPassOrder(where: {status: {_eq: CONFIRMED}}) {
    eventPassId
    quantity
  }
}
    `;
export const useGetEventPassOrdersConfirmedQuery = <
      TData = Types.GetEventPassOrdersConfirmedQuery,
      TError = Error
    >(
      variables?: Types.GetEventPassOrdersConfirmedQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassOrdersConfirmedQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassOrdersConfirmedQuery, TError, TData>(
      variables === undefined ? ['GetEventPassOrdersConfirmed'] : ['GetEventPassOrdersConfirmed', variables],
      fetchDataReactQuery<Types.GetEventPassOrdersConfirmedQuery, Types.GetEventPassOrdersConfirmedQueryVariables>(GetEventPassOrdersConfirmedDocument, variables),
      options
    );
export const GetEventPassOrdersFromIdsDocument = `
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
export const useGetEventPassOrdersFromIdsQuery = <
      TData = Types.GetEventPassOrdersFromIdsQuery,
      TError = Error
    >(
      variables: Types.GetEventPassOrdersFromIdsQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassOrdersFromIdsQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassOrdersFromIdsQuery, TError, TData>(
      ['GetEventPassOrdersFromIds', variables],
      fetchDataReactQuery<Types.GetEventPassOrdersFromIdsQuery, Types.GetEventPassOrdersFromIdsQueryVariables>(GetEventPassOrdersFromIdsDocument, variables),
      options
    );
export const GetEventPassOrdersConfirmedOrCompletedForEventPassIdDocument = `
    query GetEventPassOrdersConfirmedOrCompletedForEventPassId($eventPassId: String!) {
  eventPassOrder(
    where: {status: {_in: [CONFIRMED, COMPLETED]}, eventPassId: {_eq: $eventPassId}}
  ) {
    eventPassId
    quantity
  }
}
    `;
export const useGetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery = <
      TData = Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery,
      TError = Error
    >(
      variables: Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery, TError, TData>(
      ['GetEventPassOrdersConfirmedOrCompletedForEventPassId', variables],
      fetchDataReactQuery<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQuery, Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdQueryVariables>(GetEventPassOrdersConfirmedOrCompletedForEventPassIdDocument, variables),
      options
    );
export const GetEventPassOrdersConfirmedOrCompletedForEventPassIdsDocument = `
    query GetEventPassOrdersConfirmedOrCompletedForEventPassIds($eventPassIds: [String!]!) {
  eventPassOrder(
    where: {status: {_in: [CONFIRMED, COMPLETED]}, eventPassId: {_in: $eventPassIds}}
  ) {
    eventPassId
    quantity
  }
}
    `;
export const useGetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery = <
      TData = Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery,
      TError = Error
    >(
      variables: Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery, TError, TData>(
      ['GetEventPassOrdersConfirmedOrCompletedForEventPassIds', variables],
      fetchDataReactQuery<Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQuery, Types.GetEventPassOrdersConfirmedOrCompletedForEventPassIdsQueryVariables>(GetEventPassOrdersConfirmedOrCompletedForEventPassIdsDocument, variables),
      options
    );
export const UpsertEventPassPendingOrderDocument = `
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
export const useUpsertEventPassPendingOrderMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertEventPassPendingOrderMutation, TError, Types.UpsertEventPassPendingOrderMutationVariables, TContext>) =>
    useMutation<Types.UpsertEventPassPendingOrderMutation, TError, Types.UpsertEventPassPendingOrderMutationVariables, TContext>(
      ['UpsertEventPassPendingOrder'],
      (variables?: Types.UpsertEventPassPendingOrderMutationVariables) => fetchDataReactQuery<Types.UpsertEventPassPendingOrderMutation, Types.UpsertEventPassPendingOrderMutationVariables>(UpsertEventPassPendingOrderDocument, variables)(),
      options
    );
export const UpsertEventPassPendingOrdersDocument = `
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
export const useUpsertEventPassPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertEventPassPendingOrdersMutation, TError, Types.UpsertEventPassPendingOrdersMutationVariables, TContext>) =>
    useMutation<Types.UpsertEventPassPendingOrdersMutation, TError, Types.UpsertEventPassPendingOrdersMutationVariables, TContext>(
      ['UpsertEventPassPendingOrders'],
      (variables?: Types.UpsertEventPassPendingOrdersMutationVariables) => fetchDataReactQuery<Types.UpsertEventPassPendingOrdersMutation, Types.UpsertEventPassPendingOrdersMutationVariables>(UpsertEventPassPendingOrdersDocument, variables)(),
      options
    );
export const DeleteEventPassPendingOrderDocument = `
    mutation DeleteEventPassPendingOrder($eventPassPendingOrderId: uuid!) {
  delete_eventPassPendingOrder_by_pk(id: $eventPassPendingOrderId) {
    id
  }
}
    `;
export const useDeleteEventPassPendingOrderMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeleteEventPassPendingOrderMutation, TError, Types.DeleteEventPassPendingOrderMutationVariables, TContext>) =>
    useMutation<Types.DeleteEventPassPendingOrderMutation, TError, Types.DeleteEventPassPendingOrderMutationVariables, TContext>(
      ['DeleteEventPassPendingOrder'],
      (variables?: Types.DeleteEventPassPendingOrderMutationVariables) => fetchDataReactQuery<Types.DeleteEventPassPendingOrderMutation, Types.DeleteEventPassPendingOrderMutationVariables>(DeleteEventPassPendingOrderDocument, variables)(),
      options
    );
export const DeleteEventPassPendingOrdersDocument = `
    mutation DeleteEventPassPendingOrders($eventPassIds: [String!]!) {
  delete_eventPassPendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    affected_rows
  }
}
    `;
export const useDeleteEventPassPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeleteEventPassPendingOrdersMutation, TError, Types.DeleteEventPassPendingOrdersMutationVariables, TContext>) =>
    useMutation<Types.DeleteEventPassPendingOrdersMutation, TError, Types.DeleteEventPassPendingOrdersMutationVariables, TContext>(
      ['DeleteEventPassPendingOrders'],
      (variables?: Types.DeleteEventPassPendingOrdersMutationVariables) => fetchDataReactQuery<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables)(),
      options
    );
export const DeleteAllEventPassPendingOrdersDocument = `
    mutation DeleteAllEventPassPendingOrders {
  delete_eventPassPendingOrder(where: {}) {
    affected_rows
  }
}
    `;
export const useDeleteAllEventPassPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeleteAllEventPassPendingOrdersMutation, TError, Types.DeleteAllEventPassPendingOrdersMutationVariables, TContext>) =>
    useMutation<Types.DeleteAllEventPassPendingOrdersMutation, TError, Types.DeleteAllEventPassPendingOrdersMutationVariables, TContext>(
      ['DeleteAllEventPassPendingOrders'],
      (variables?: Types.DeleteAllEventPassPendingOrdersMutationVariables) => fetchDataReactQuery<Types.DeleteAllEventPassPendingOrdersMutation, Types.DeleteAllEventPassPendingOrdersMutationVariables>(DeleteAllEventPassPendingOrdersDocument, variables)(),
      options
    );
export const GetEventPassPendingOrderForEventPassDocument = `
    query GetEventPassPendingOrderForEventPass($eventPassId: String!) {
  eventPassPendingOrder(where: {eventPassId: {_eq: $eventPassId}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;
export const useGetEventPassPendingOrderForEventPassQuery = <
      TData = Types.GetEventPassPendingOrderForEventPassQuery,
      TError = Error
    >(
      variables: Types.GetEventPassPendingOrderForEventPassQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassPendingOrderForEventPassQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassPendingOrderForEventPassQuery, TError, TData>(
      ['GetEventPassPendingOrderForEventPass', variables],
      fetchDataReactQuery<Types.GetEventPassPendingOrderForEventPassQuery, Types.GetEventPassPendingOrderForEventPassQueryVariables>(GetEventPassPendingOrderForEventPassDocument, variables),
      options
    );
export const GetEventPassPendingOrderForEventPassesDocument = `
    query GetEventPassPendingOrderForEventPasses($eventPassIds: [String!]) {
  eventPassPendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;
export const useGetEventPassPendingOrderForEventPassesQuery = <
      TData = Types.GetEventPassPendingOrderForEventPassesQuery,
      TError = Error
    >(
      variables?: Types.GetEventPassPendingOrderForEventPassesQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassPendingOrderForEventPassesQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassPendingOrderForEventPassesQuery, TError, TData>(
      variables === undefined ? ['GetEventPassPendingOrderForEventPasses'] : ['GetEventPassPendingOrderForEventPasses', variables],
      fetchDataReactQuery<Types.GetEventPassPendingOrderForEventPassesQuery, Types.GetEventPassPendingOrderForEventPassesQueryVariables>(GetEventPassPendingOrderForEventPassesDocument, variables),
      options
    );
export const GetEventPassPendingOrdersDocument = `
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
export const useGetEventPassPendingOrdersQuery = <
      TData = Types.GetEventPassPendingOrdersQuery,
      TError = Error
    >(
      variables: Types.GetEventPassPendingOrdersQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassPendingOrdersQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassPendingOrdersQuery, TError, TData>(
      ['GetEventPassPendingOrders', variables],
      fetchDataReactQuery<Types.GetEventPassPendingOrdersQuery, Types.GetEventPassPendingOrdersQueryVariables>(GetEventPassPendingOrdersDocument, variables),
      options
    );
export const GetEventPassPendingOrdersMinimalDocument = `
    query GetEventPassPendingOrdersMinimal {
  eventPassPendingOrder {
    eventPassId
    quantity
  }
}
    `;
export const useGetEventPassPendingOrdersMinimalQuery = <
      TData = Types.GetEventPassPendingOrdersMinimalQuery,
      TError = Error
    >(
      variables?: Types.GetEventPassPendingOrdersMinimalQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassPendingOrdersMinimalQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassPendingOrdersMinimalQuery, TError, TData>(
      variables === undefined ? ['GetEventPassPendingOrdersMinimal'] : ['GetEventPassPendingOrdersMinimal', variables],
      fetchDataReactQuery<Types.GetEventPassPendingOrdersMinimalQuery, Types.GetEventPassPendingOrdersMinimalQueryVariables>(GetEventPassPendingOrdersMinimalDocument, variables),
      options
    );
export const GetKycDocument = `
    query GetKyc {
  kyc {
    applicantId
    reviewStatus
    levelName
  }
}
    `;
export const useGetKycQuery = <
      TData = Types.GetKycQuery,
      TError = Error
    >(
      variables?: Types.GetKycQueryVariables,
      options?: UseQueryOptions<Types.GetKycQuery, TError, TData>
    ) =>
    useQuery<Types.GetKycQuery, TError, TData>(
      variables === undefined ? ['GetKyc'] : ['GetKyc', variables],
      fetchDataReactQuery<Types.GetKycQuery, Types.GetKycQueryVariables>(GetKycDocument, variables),
      options
    );
export const GetPassedEventsWithEventPassNftsDocument = `
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
export const useGetPassedEventsWithEventPassNftsQuery = <
      TData = Types.GetPassedEventsWithEventPassNftsQuery,
      TError = Error
    >(
      variables: Types.GetPassedEventsWithEventPassNftsQueryVariables,
      options?: UseQueryOptions<Types.GetPassedEventsWithEventPassNftsQuery, TError, TData>
    ) =>
    useQuery<Types.GetPassedEventsWithEventPassNftsQuery, TError, TData>(
      ['GetPassedEventsWithEventPassNfts', variables],
      fetchDataReactQuery<Types.GetPassedEventsWithEventPassNftsQuery, Types.GetPassedEventsWithEventPassNftsQueryVariables>(GetPassedEventsWithEventPassNftsDocument, variables),
      options
    );
export const GetUpcomingEventsWithEventPassNftsDocument = `
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
export const useGetUpcomingEventsWithEventPassNftsQuery = <
      TData = Types.GetUpcomingEventsWithEventPassNftsQuery,
      TError = Error
    >(
      variables: Types.GetUpcomingEventsWithEventPassNftsQueryVariables,
      options?: UseQueryOptions<Types.GetUpcomingEventsWithEventPassNftsQuery, TError, TData>
    ) =>
    useQuery<Types.GetUpcomingEventsWithEventPassNftsQuery, TError, TData>(
      ['GetUpcomingEventsWithEventPassNfts', variables],
      fetchDataReactQuery<Types.GetUpcomingEventsWithEventPassNftsQuery, Types.GetUpcomingEventsWithEventPassNftsQueryVariables>(GetUpcomingEventsWithEventPassNftsDocument, variables),
      options
    );
export const GetEventPassNftByTokenReferenceDocument = `
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
export const useGetEventPassNftByTokenReferenceQuery = <
      TData = Types.GetEventPassNftByTokenReferenceQuery,
      TError = Error
    >(
      variables: Types.GetEventPassNftByTokenReferenceQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>(
      ['GetEventPassNftByTokenReference', variables],
      fetchDataReactQuery<Types.GetEventPassNftByTokenReferenceQuery, Types.GetEventPassNftByTokenReferenceQueryVariables>(GetEventPassNftByTokenReferenceDocument, variables),
      options
    );
export const GetStripeCustomerDocument = `
    query GetStripeCustomer {
  stripeCustomer {
    stripeCustomerId
    accountId
  }
}
    `;
export const useGetStripeCustomerQuery = <
      TData = Types.GetStripeCustomerQuery,
      TError = Error
    >(
      variables?: Types.GetStripeCustomerQueryVariables,
      options?: UseQueryOptions<Types.GetStripeCustomerQuery, TError, TData>
    ) =>
    useQuery<Types.GetStripeCustomerQuery, TError, TData>(
      variables === undefined ? ['GetStripeCustomer'] : ['GetStripeCustomer', variables],
      fetchDataReactQuery<Types.GetStripeCustomerQuery, Types.GetStripeCustomerQueryVariables>(GetStripeCustomerDocument, variables),
      options
    );