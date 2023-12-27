import * as Types from '@gql/user/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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