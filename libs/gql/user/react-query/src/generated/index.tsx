import * as Types from '@gql/user/types';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { fetchDataReactQuery } from '@next/hasura/react-query';

export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  address
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
export const GetAccountDocument = `
    query GetAccount($address: String!) {
  account(where: {address: {_eq: $address}}, limit: 1) {
    ...AccountFields
  }
}
    ${AccountFieldsFragmentDoc}`;

export const useGetAccountQuery = <
      TData = Types.GetAccountQuery,
      TError = Error
    >(
      variables: Types.GetAccountQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetAccountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetAccountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetAccountQuery, TError, TData>(
      {
    queryKey: ['GetAccount', variables],
    queryFn: fetchDataReactQuery<Types.GetAccountQuery, Types.GetAccountQueryVariables>(GetAccountDocument, variables),
    ...options
  }
    )};

export const GetEventWithPassesDocument = `
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

export const useGetEventWithPassesQuery = <
      TData = Types.GetEventWithPassesQuery,
      TError = Error
    >(
      variables: Types.GetEventWithPassesQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetEventWithPassesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetEventWithPassesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetEventWithPassesQuery, TError, TData>(
      {
    queryKey: ['GetEventWithPasses', variables],
    queryFn: fetchDataReactQuery<Types.GetEventWithPassesQuery, Types.GetEventWithPassesQueryVariables>(GetEventWithPassesDocument, variables),
    ...options
  }
    )};

export const GetOrdersConfirmedDocument = `
    query GetOrdersConfirmed {
  order(where: {status: {_eq: CONFIRMED}}) {
    eventPassId
    quantity
  }
}
    `;

export const useGetOrdersConfirmedQuery = <
      TData = Types.GetOrdersConfirmedQuery,
      TError = Error
    >(
      variables?: Types.GetOrdersConfirmedQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetOrdersConfirmedQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetOrdersConfirmedQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetOrdersConfirmedQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetOrdersConfirmed'] : ['GetOrdersConfirmed', variables],
    queryFn: fetchDataReactQuery<Types.GetOrdersConfirmedQuery, Types.GetOrdersConfirmedQueryVariables>(GetOrdersConfirmedDocument, variables),
    ...options
  }
    )};

export const GetOrdersIsMintingDocument = `
    query GetOrdersIsMinting {
  order(where: {status: {_eq: IS_MINTING}}) {
    eventPassId
    quantity
  }
}
    `;

export const useGetOrdersIsMintingQuery = <
      TData = Types.GetOrdersIsMintingQuery,
      TError = Error
    >(
      variables?: Types.GetOrdersIsMintingQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetOrdersIsMintingQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetOrdersIsMintingQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetOrdersIsMintingQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetOrdersIsMinting'] : ['GetOrdersIsMinting', variables],
    queryFn: fetchDataReactQuery<Types.GetOrdersIsMintingQuery, Types.GetOrdersIsMintingQueryVariables>(GetOrdersIsMintingDocument, variables),
    ...options
  }
    )};

export const GetOrdersFromIdsDocument = `
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

export const useGetOrdersFromIdsQuery = <
      TData = Types.GetOrdersFromIdsQuery,
      TError = Error
    >(
      variables: Types.GetOrdersFromIdsQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetOrdersFromIdsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetOrdersFromIdsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetOrdersFromIdsQuery, TError, TData>(
      {
    queryKey: ['GetOrdersFromIds', variables],
    queryFn: fetchDataReactQuery<Types.GetOrdersFromIdsQuery, Types.GetOrdersFromIdsQueryVariables>(GetOrdersFromIdsDocument, variables),
    ...options
  }
    )};

export const GetOrderPurchasedForEventPassesIdDocument = `
    query GetOrderPurchasedForEventPassesId($eventPassId: String!) {
  order(
    where: {status: {_in: [CONFIRMED, COMPLETED, IS_MINTING]}, eventPassId: {_eq: $eventPassId}}
  ) {
    eventPassId
    quantity
  }
}
    `;

export const useGetOrderPurchasedForEventPassesIdQuery = <
      TData = Types.GetOrderPurchasedForEventPassesIdQuery,
      TError = Error
    >(
      variables: Types.GetOrderPurchasedForEventPassesIdQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetOrderPurchasedForEventPassesIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetOrderPurchasedForEventPassesIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetOrderPurchasedForEventPassesIdQuery, TError, TData>(
      {
    queryKey: ['GetOrderPurchasedForEventPassesId', variables],
    queryFn: fetchDataReactQuery<Types.GetOrderPurchasedForEventPassesIdQuery, Types.GetOrderPurchasedForEventPassesIdQueryVariables>(GetOrderPurchasedForEventPassesIdDocument, variables),
    ...options
  }
    )};

export const GetOrderPurchasedForEventPassesIdsDocument = `
    query GetOrderPurchasedForEventPassesIds($eventPassIds: [String!]!) {
  order(
    where: {status: {_in: [CONFIRMED, COMPLETED, IS_MINTING]}, eventPassId: {_in: $eventPassIds}}
  ) {
    eventPassId
    quantity
  }
}
    `;

export const useGetOrderPurchasedForEventPassesIdsQuery = <
      TData = Types.GetOrderPurchasedForEventPassesIdsQuery,
      TError = Error
    >(
      variables: Types.GetOrderPurchasedForEventPassesIdsQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetOrderPurchasedForEventPassesIdsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetOrderPurchasedForEventPassesIdsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetOrderPurchasedForEventPassesIdsQuery, TError, TData>(
      {
    queryKey: ['GetOrderPurchasedForEventPassesIds', variables],
    queryFn: fetchDataReactQuery<Types.GetOrderPurchasedForEventPassesIdsQuery, Types.GetOrderPurchasedForEventPassesIdsQueryVariables>(GetOrderPurchasedForEventPassesIdsDocument, variables),
    ...options
  }
    )};

export const UpsertEventPassPendingOrderDocument = `
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

export const useUpsertEventPassPendingOrderMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertEventPassPendingOrderMutation, TError, Types.UpsertEventPassPendingOrderMutationVariables, TContext>) => {
    
    return useMutation<Types.UpsertEventPassPendingOrderMutation, TError, Types.UpsertEventPassPendingOrderMutationVariables, TContext>(
      {
    mutationKey: ['UpsertEventPassPendingOrder'],
    mutationFn: (variables?: Types.UpsertEventPassPendingOrderMutationVariables) => fetchDataReactQuery<Types.UpsertEventPassPendingOrderMutation, Types.UpsertEventPassPendingOrderMutationVariables>(UpsertEventPassPendingOrderDocument, variables)(),
    ...options
  }
    )};

export const UpsertEventPassPendingOrdersDocument = `
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

export const useUpsertEventPassPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertEventPassPendingOrdersMutation, TError, Types.UpsertEventPassPendingOrdersMutationVariables, TContext>) => {
    
    return useMutation<Types.UpsertEventPassPendingOrdersMutation, TError, Types.UpsertEventPassPendingOrdersMutationVariables, TContext>(
      {
    mutationKey: ['UpsertEventPassPendingOrders'],
    mutationFn: (variables?: Types.UpsertEventPassPendingOrdersMutationVariables) => fetchDataReactQuery<Types.UpsertEventPassPendingOrdersMutation, Types.UpsertEventPassPendingOrdersMutationVariables>(UpsertEventPassPendingOrdersDocument, variables)(),
    ...options
  }
    )};

export const UpsertPackPendingOrderDocument = `
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

export const useUpsertPackPendingOrderMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertPackPendingOrderMutation, TError, Types.UpsertPackPendingOrderMutationVariables, TContext>) => {
    
    return useMutation<Types.UpsertPackPendingOrderMutation, TError, Types.UpsertPackPendingOrderMutationVariables, TContext>(
      {
    mutationKey: ['UpsertPackPendingOrder'],
    mutationFn: (variables?: Types.UpsertPackPendingOrderMutationVariables) => fetchDataReactQuery<Types.UpsertPackPendingOrderMutation, Types.UpsertPackPendingOrderMutationVariables>(UpsertPackPendingOrderDocument, variables)(),
    ...options
  }
    )};

export const UpsertPackPendingOrdersDocument = `
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

export const useUpsertPackPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertPackPendingOrdersMutation, TError, Types.UpsertPackPendingOrdersMutationVariables, TContext>) => {
    
    return useMutation<Types.UpsertPackPendingOrdersMutation, TError, Types.UpsertPackPendingOrdersMutationVariables, TContext>(
      {
    mutationKey: ['UpsertPackPendingOrders'],
    mutationFn: (variables?: Types.UpsertPackPendingOrdersMutationVariables) => fetchDataReactQuery<Types.UpsertPackPendingOrdersMutation, Types.UpsertPackPendingOrdersMutationVariables>(UpsertPackPendingOrdersDocument, variables)(),
    ...options
  }
    )};

export const DeletePendingOrderDocument = `
    mutation DeletePendingOrder($pendingOrderId: uuid!) {
  delete_pendingOrder_by_pk(id: $pendingOrderId) {
    id
  }
}
    `;

export const useDeletePendingOrderMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeletePendingOrderMutation, TError, Types.DeletePendingOrderMutationVariables, TContext>) => {
    
    return useMutation<Types.DeletePendingOrderMutation, TError, Types.DeletePendingOrderMutationVariables, TContext>(
      {
    mutationKey: ['DeletePendingOrder'],
    mutationFn: (variables?: Types.DeletePendingOrderMutationVariables) => fetchDataReactQuery<Types.DeletePendingOrderMutation, Types.DeletePendingOrderMutationVariables>(DeletePendingOrderDocument, variables)(),
    ...options
  }
    )};

export const DeletePendingOrdersDocument = `
    mutation DeletePendingOrders($eventPassIds: [String!]!) {
  delete_pendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    affected_rows
  }
}
    `;

export const useDeletePendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeletePendingOrdersMutation, TError, Types.DeletePendingOrdersMutationVariables, TContext>) => {
    
    return useMutation<Types.DeletePendingOrdersMutation, TError, Types.DeletePendingOrdersMutationVariables, TContext>(
      {
    mutationKey: ['DeletePendingOrders'],
    mutationFn: (variables?: Types.DeletePendingOrdersMutationVariables) => fetchDataReactQuery<Types.DeletePendingOrdersMutation, Types.DeletePendingOrdersMutationVariables>(DeletePendingOrdersDocument, variables)(),
    ...options
  }
    )};

export const DeleteAllPendingOrdersDocument = `
    mutation DeleteAllPendingOrders {
  delete_pendingOrder(where: {}) {
    affected_rows
  }
}
    `;

export const useDeleteAllPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeleteAllPendingOrdersMutation, TError, Types.DeleteAllPendingOrdersMutationVariables, TContext>) => {
    
    return useMutation<Types.DeleteAllPendingOrdersMutation, TError, Types.DeleteAllPendingOrdersMutationVariables, TContext>(
      {
    mutationKey: ['DeleteAllPendingOrders'],
    mutationFn: (variables?: Types.DeleteAllPendingOrdersMutationVariables) => fetchDataReactQuery<Types.DeleteAllPendingOrdersMutation, Types.DeleteAllPendingOrdersMutationVariables>(DeleteAllPendingOrdersDocument, variables)(),
    ...options
  }
    )};

export const GetPendingOrderForEventPassDocument = `
    query GetPendingOrderForEventPass($eventPassId: String!) {
  pendingOrder(where: {eventPassId: {_eq: $eventPassId}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;

export const useGetPendingOrderForEventPassQuery = <
      TData = Types.GetPendingOrderForEventPassQuery,
      TError = Error
    >(
      variables: Types.GetPendingOrderForEventPassQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetPendingOrderForEventPassQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetPendingOrderForEventPassQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetPendingOrderForEventPassQuery, TError, TData>(
      {
    queryKey: ['GetPendingOrderForEventPass', variables],
    queryFn: fetchDataReactQuery<Types.GetPendingOrderForEventPassQuery, Types.GetPendingOrderForEventPassQueryVariables>(GetPendingOrderForEventPassDocument, variables),
    ...options
  }
    )};

export const GetPendingOrderForEventPassesDocument = `
    query GetPendingOrderForEventPasses($eventPassIds: [String!]) {
  pendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    id
    eventPassId
    quantity
    created_at
  }
}
    `;

export const useGetPendingOrderForEventPassesQuery = <
      TData = Types.GetPendingOrderForEventPassesQuery,
      TError = Error
    >(
      variables?: Types.GetPendingOrderForEventPassesQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetPendingOrderForEventPassesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetPendingOrderForEventPassesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetPendingOrderForEventPassesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetPendingOrderForEventPasses'] : ['GetPendingOrderForEventPasses', variables],
    queryFn: fetchDataReactQuery<Types.GetPendingOrderForEventPassesQuery, Types.GetPendingOrderForEventPassesQueryVariables>(GetPendingOrderForEventPassesDocument, variables),
    ...options
  }
    )};

export const GetPendingOrdersDocument = `
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

export const useGetPendingOrdersQuery = <
      TData = Types.GetPendingOrdersQuery,
      TError = Error
    >(
      variables: Types.GetPendingOrdersQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetPendingOrdersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetPendingOrdersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetPendingOrdersQuery, TError, TData>(
      {
    queryKey: ['GetPendingOrders', variables],
    queryFn: fetchDataReactQuery<Types.GetPendingOrdersQuery, Types.GetPendingOrdersQueryVariables>(GetPendingOrdersDocument, variables),
    ...options
  }
    )};

export const GetPendingOrdersMinimalDocument = `
    query GetPendingOrdersMinimal {
  pendingOrder {
    eventPassId
    packId
    quantity
  }
}
    `;

export const useGetPendingOrdersMinimalQuery = <
      TData = Types.GetPendingOrdersMinimalQuery,
      TError = Error
    >(
      variables?: Types.GetPendingOrdersMinimalQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetPendingOrdersMinimalQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetPendingOrdersMinimalQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetPendingOrdersMinimalQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetPendingOrdersMinimal'] : ['GetPendingOrdersMinimal', variables],
    queryFn: fetchDataReactQuery<Types.GetPendingOrdersMinimalQuery, Types.GetPendingOrdersMinimalQueryVariables>(GetPendingOrdersMinimalDocument, variables),
    ...options
  }
    )};

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
      options?: Omit<UseQueryOptions<Types.GetKycQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetKycQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetKycQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetKyc'] : ['GetKyc', variables],
    queryFn: fetchDataReactQuery<Types.GetKycQuery, Types.GetKycQueryVariables>(GetKycDocument, variables),
    ...options
  }
    )};

export const InsertFollowOrganizerDocument = `
    mutation InsertFollowOrganizer($organizerSlug: String!) {
  insert_follow_one(object: {organizerSlug: $organizerSlug}) {
    organizerSlug
  }
}
    `;

export const useInsertFollowOrganizerMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.InsertFollowOrganizerMutation, TError, Types.InsertFollowOrganizerMutationVariables, TContext>) => {
    
    return useMutation<Types.InsertFollowOrganizerMutation, TError, Types.InsertFollowOrganizerMutationVariables, TContext>(
      {
    mutationKey: ['InsertFollowOrganizer'],
    mutationFn: (variables?: Types.InsertFollowOrganizerMutationVariables) => fetchDataReactQuery<Types.InsertFollowOrganizerMutation, Types.InsertFollowOrganizerMutationVariables>(InsertFollowOrganizerDocument, variables)(),
    ...options
  }
    )};

export const GetPassedEventsWithEventPassNftsDocument = `
    query GetPassedEventsWithEventPassNfts($address: String!, $currentDate: timestamp!, $locale: Locale!, $stage: Stage!) {
  eventParameters(
    where: {eventPassNfts: {currentOwnerAddress: {_ilike: $address}}, dateEnd: {_lt: $currentDate}, status: {_eq: PUBLISHED}}
    order_by: {dateEnd: desc}
  ) {
    dateStart
    dateEnd
    timezone
    eventPassNftContracts(
      where: {eventPassNfts: {currentOwnerAddress: {_ilike: $address}}}
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
      eventPassNfts(where: {currentOwnerAddress: {_ilike: $address}}) {
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

export const useGetPassedEventsWithEventPassNftsQuery = <
      TData = Types.GetPassedEventsWithEventPassNftsQuery,
      TError = Error
    >(
      variables: Types.GetPassedEventsWithEventPassNftsQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetPassedEventsWithEventPassNftsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetPassedEventsWithEventPassNftsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetPassedEventsWithEventPassNftsQuery, TError, TData>(
      {
    queryKey: ['GetPassedEventsWithEventPassNfts', variables],
    queryFn: fetchDataReactQuery<Types.GetPassedEventsWithEventPassNftsQuery, Types.GetPassedEventsWithEventPassNftsQueryVariables>(GetPassedEventsWithEventPassNftsDocument, variables),
    ...options
  }
    )};

export const GetUpcomingEventsWithEventPassNftsDocument = `
    query GetUpcomingEventsWithEventPassNfts($address: String!, $currentDate: timestamp!, $locale: Locale!, $stage: Stage!) {
  eventParameters(
    where: {eventPassNfts: {currentOwnerAddress: {_ilike: $address}}, dateEnd: {_gte: $currentDate}, status: {_eq: PUBLISHED}}
    order_by: {dateStart: asc}
  ) {
    dateStart
    dateEnd
    timezone
    eventPassNftContracts(
      where: {eventPassNfts: {currentOwnerAddress: {_ilike: $address}}}
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
      eventPassNfts(where: {currentOwnerAddress: {_ilike: $address}}) {
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

export const useGetUpcomingEventsWithEventPassNftsQuery = <
      TData = Types.GetUpcomingEventsWithEventPassNftsQuery,
      TError = Error
    >(
      variables: Types.GetUpcomingEventsWithEventPassNftsQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetUpcomingEventsWithEventPassNftsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetUpcomingEventsWithEventPassNftsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetUpcomingEventsWithEventPassNftsQuery, TError, TData>(
      {
    queryKey: ['GetUpcomingEventsWithEventPassNfts', variables],
    queryFn: fetchDataReactQuery<Types.GetUpcomingEventsWithEventPassNftsQuery, Types.GetUpcomingEventsWithEventPassNftsQueryVariables>(GetUpcomingEventsWithEventPassNftsDocument, variables),
    ...options
  }
    )};

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
      options?: Omit<UseQueryOptions<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>(
      {
    queryKey: ['GetEventPassNftByTokenReference', variables],
    queryFn: fetchDataReactQuery<Types.GetEventPassNftByTokenReferenceQuery, Types.GetEventPassNftByTokenReferenceQueryVariables>(GetEventPassNftByTokenReferenceDocument, variables),
    ...options
  }
    )};

export const GetMyRolesDocument = `
    query GetMyRoles {
  roleAssignment {
    ...RoleAssignmentFields
  }
}
    ${RoleAssignmentFieldsFragmentDoc}`;

export const useGetMyRolesQuery = <
      TData = Types.GetMyRolesQuery,
      TError = Error
    >(
      variables?: Types.GetMyRolesQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetMyRolesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetMyRolesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetMyRolesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMyRoles'] : ['GetMyRoles', variables],
    queryFn: fetchDataReactQuery<Types.GetMyRolesQuery, Types.GetMyRolesQueryVariables>(GetMyRolesDocument, variables),
    ...options
  }
    )};

export const GetMyRolesWithOrganizerInfosDocument = `
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

export const useGetMyRolesWithOrganizerInfosQuery = <
      TData = Types.GetMyRolesWithOrganizerInfosQuery,
      TError = Error
    >(
      variables: Types.GetMyRolesWithOrganizerInfosQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetMyRolesWithOrganizerInfosQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetMyRolesWithOrganizerInfosQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetMyRolesWithOrganizerInfosQuery, TError, TData>(
      {
    queryKey: ['GetMyRolesWithOrganizerInfos', variables],
    queryFn: fetchDataReactQuery<Types.GetMyRolesWithOrganizerInfosQuery, Types.GetMyRolesWithOrganizerInfosQueryVariables>(GetMyRolesWithOrganizerInfosDocument, variables),
    ...options
  }
    )};

export const GetMyRolesWithOrganizerAndInviterInfosDocument = `
    query GetMyRolesWithOrganizerAndInviterInfos($stage: Stage!) {
  roleAssignment {
    ...RoleAssignmentFields
    organizer(where: {}, locales: [en], stage: $stage) {
      ...OrganizerFields
    }
    inviter {
      address
    }
  }
}
    ${RoleAssignmentFieldsFragmentDoc}
${OrganizerFieldsFragmentDoc}`;

export const useGetMyRolesWithOrganizerAndInviterInfosQuery = <
      TData = Types.GetMyRolesWithOrganizerAndInviterInfosQuery,
      TError = Error
    >(
      variables: Types.GetMyRolesWithOrganizerAndInviterInfosQueryVariables,
      options?: Omit<UseQueryOptions<Types.GetMyRolesWithOrganizerAndInviterInfosQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetMyRolesWithOrganizerAndInviterInfosQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetMyRolesWithOrganizerAndInviterInfosQuery, TError, TData>(
      {
    queryKey: ['GetMyRolesWithOrganizerAndInviterInfos', variables],
    queryFn: fetchDataReactQuery<Types.GetMyRolesWithOrganizerAndInviterInfosQuery, Types.GetMyRolesWithOrganizerAndInviterInfosQueryVariables>(GetMyRolesWithOrganizerAndInviterInfosDocument, variables),
    ...options
  }
    )};

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
      options?: Omit<UseQueryOptions<Types.GetStripeCustomerQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<Types.GetStripeCustomerQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<Types.GetStripeCustomerQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetStripeCustomer'] : ['GetStripeCustomer', variables],
    queryFn: fetchDataReactQuery<Types.GetStripeCustomerQuery, Types.GetStripeCustomerQueryVariables>(GetStripeCustomerDocument, variables),
    ...options
  }
    )};
