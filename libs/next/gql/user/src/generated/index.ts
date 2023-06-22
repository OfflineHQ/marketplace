import * as types from "./types";
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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
      TData = GetAccountQuery,
      TError = Error
    >(
      variables: GetAccountQueryVariables,
      options?: UseQueryOptions<GetAccountQuery, TError, TData>
    ) =>
    useQuery<GetAccountQuery, TError, TData>(
      ['GetAccount', variables],
      fetchDataReactQuery<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, variables),
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
      TData = GetAccountByEmailQuery,
      TError = Error
    >(
      variables: GetAccountByEmailQueryVariables,
      options?: UseQueryOptions<GetAccountByEmailQuery, TError, TData>
    ) =>
    useQuery<GetAccountByEmailQuery, TError, TData>(
      ['GetAccountByEmail', variables],
      fetchDataReactQuery<GetAccountByEmailQuery, GetAccountByEmailQueryVariables>(GetAccountByEmailDocument, variables),
      options
    );