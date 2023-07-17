import * as Types from '@gql/user/types';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { fetchDataReactQuery } from '@next/hasura/fetcher';
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
    query GetEventWithPasses($slug: String!, $locale: Locale!, $stage: Stage!) {
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
      price {
        amount
        currency
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
export const GetEventPassOrderForEventPassesDocument = `
    query GetEventPassOrderForEventPasses($eventPassIds: [String!]) {
  eventPassOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    eventPassId
    quantity
    status
    created_at
  }
}
    `;
export const useGetEventPassOrderForEventPassesQuery = <
      TData = Types.GetEventPassOrderForEventPassesQuery,
      TError = Error
    >(
      variables?: Types.GetEventPassOrderForEventPassesQueryVariables,
      options?: UseQueryOptions<Types.GetEventPassOrderForEventPassesQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassOrderForEventPassesQuery, TError, TData>(
      variables === undefined ? ['GetEventPassOrderForEventPasses'] : ['GetEventPassOrderForEventPasses', variables],
      fetchDataReactQuery<Types.GetEventPassOrderForEventPassesQuery, Types.GetEventPassOrderForEventPassesQueryVariables>(GetEventPassOrderForEventPassesDocument, variables),
      options
    );
export const UpsertEventPassOrdersDocument = `
    mutation UpsertEventPassOrders($objects: [eventPassOrder_insert_input!]!) {
  insert_eventPassOrder(
    objects: $objects
    on_conflict: {constraint: eventPassOrder_pkey, update_columns: [quantity]}
  ) {
    returning {
      quantity
      status
      eventPassId
      created_at
    }
  }
}
    `;
export const useUpsertEventPassOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpsertEventPassOrdersMutation, TError, Types.UpsertEventPassOrdersMutationVariables, TContext>) =>
    useMutation<Types.UpsertEventPassOrdersMutation, TError, Types.UpsertEventPassOrdersMutationVariables, TContext>(
      ['UpsertEventPassOrders'],
      (variables?: Types.UpsertEventPassOrdersMutationVariables) => fetchDataReactQuery<Types.UpsertEventPassOrdersMutation, Types.UpsertEventPassOrdersMutationVariables>(UpsertEventPassOrdersDocument, variables)(),
      options
    );
export const DeleteEventPassOrdersDocument = `
    mutation DeleteEventPassOrders($eventPassIds: [String!]) {
  delete_eventPassOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    affected_rows
  }
}
    `;
export const useDeleteEventPassOrdersMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<Types.DeleteEventPassOrdersMutation, TError, Types.DeleteEventPassOrdersMutationVariables, TContext>) =>
    useMutation<Types.DeleteEventPassOrdersMutation, TError, Types.DeleteEventPassOrdersMutationVariables, TContext>(
      ['DeleteEventPassOrders'],
      (variables?: Types.DeleteEventPassOrdersMutationVariables) => fetchDataReactQuery<Types.DeleteEventPassOrdersMutation, Types.DeleteEventPassOrdersMutationVariables>(DeleteEventPassOrdersDocument, variables)(),
      options
    );