import * as Types from '@gql/user/types';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { fetchDataReactQuery } from '@next/hasura/react-query';
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  email
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
export const InsertEventPassPendingOrdersDocument = `
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
export const useInsertEventPassPendingOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.InsertEventPassPendingOrdersMutation, TError, Types.InsertEventPassPendingOrdersMutationVariables, TContext>) =>
    useMutation<Types.InsertEventPassPendingOrdersMutation, TError, Types.InsertEventPassPendingOrdersMutationVariables, TContext>(
      ['InsertEventPassPendingOrders'],
      (variables?: Types.InsertEventPassPendingOrdersMutationVariables) => fetchDataReactQuery<Types.InsertEventPassPendingOrdersMutation, Types.InsertEventPassPendingOrdersMutationVariables>(InsertEventPassPendingOrdersDocument, variables)(),
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