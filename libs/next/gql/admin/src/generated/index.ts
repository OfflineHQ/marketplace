import { fetchData } from "@next/hasura/fetcher";
import * as types from "./types";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  address
  email
  emailVerified
}
    `;
export const EventListFieldsFragmentDoc = `
    fragment EventListFields on Event {
  id
  slug
  title
  heroImage {
    url
  }
}
    `;
export const OrganizerFieldsFragmentDoc = `
    fragment OrganizerFields on Organizer {
  id
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
 const GetEventDocument = `
    query GetEvent($slug: String!, $locale: Locale!, $stage: Stage!) {
  event(where: {slug: $slug}, locales: [$locale], stage: $stage) {
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
      ...OrganizerFields
    }
    eventDateLocations {
      ...EventDateLocationsFields
    }
  }
}
    ${EventListFieldsFragmentDoc}
${OrganizerFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}`;
 const GetOrganizerDocument = `
    query GetOrganizer($slug: String!, $locale: Locale!, $stage: Stage!) {
  organizer(where: {slug: $slug}, locales: [$locale], stage: $stage) {
    ...OrganizerFields
  }
}
    ${OrganizerFieldsFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: string, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    UpdateAccount(variables: UpdateAccountMutationVariables, options?: C): Promise<UpdateAccountMutation> {
      return requester<UpdateAccountMutation, UpdateAccountMutationVariables>(UpdateAccountDocument, variables, options) as Promise<UpdateAccountMutation>;
    },
    CreateAccount(variables: CreateAccountMutationVariables, options?: C): Promise<CreateAccountMutation> {
      return requester<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, variables, options) as Promise<CreateAccountMutation>;
    },
    GetAccount(variables: GetAccountQueryVariables, options?: C): Promise<GetAccountQuery> {
      return requester<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, variables, options) as Promise<GetAccountQuery>;
    },
    GetAccountByEmail(variables: GetAccountByEmailQueryVariables, options?: C): Promise<GetAccountByEmailQuery> {
      return requester<GetAccountByEmailQuery, GetAccountByEmailQueryVariables>(GetAccountByEmailDocument, variables, options) as Promise<GetAccountByEmailQuery>;
    },
    GetEvent(variables: GetEventQueryVariables, options?: C): Promise<GetEventQuery> {
      return requester<GetEventQuery, GetEventQueryVariables>(GetEventDocument, variables, options) as Promise<GetEventQuery>;
    },
    GetOrganizer(variables: GetOrganizerQueryVariables, options?: C): Promise<GetOrganizerQuery> {
      return requester<GetOrganizerQuery, GetOrganizerQueryVariables>(GetOrganizerDocument, variables, options) as Promise<GetOrganizerQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const adminSdk = getSdk(fetchData({admin:true}));