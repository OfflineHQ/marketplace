import * as Types from './types';

import { fetchData } from "@next/hasura/fetcher";
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
      id
      slug
      name
      image {
        url
      }
    }
    eventDateLocations {
      ...EventDateLocationsFields
    }
  }
}
    ${EventListFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}`;
 const GetEventPassesDocument = `
    query GetEventPasses($eventSlug: String!, $locale: Locale!, $stage: Stage!) {
  eventPasses(
    where: {event: {slug: $eventSlug}}
    locales: [$locale]
    stage: $stage
  ) {
    id
    name
    maxAmount
    maxAmountPerUser
    description
    price {
      currency
      amount
    }
    passOptions {
      name
      description
      eventDateLocation {
        ...EventDateLocationsFields
      }
    }
  }
}
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
    UpdateAccount(variables: Types.UpdateAccountMutationVariables, options?: C): Promise<Types.UpdateAccountMutation> {
      return requester<Types.UpdateAccountMutation, Types.UpdateAccountMutationVariables>(UpdateAccountDocument, variables, options) as Promise<Types.UpdateAccountMutation>;
    },
    CreateAccount(variables: Types.CreateAccountMutationVariables, options?: C): Promise<Types.CreateAccountMutation> {
      return requester<Types.CreateAccountMutation, Types.CreateAccountMutationVariables>(CreateAccountDocument, variables, options) as Promise<Types.CreateAccountMutation>;
    },
    GetAccount(variables: Types.GetAccountQueryVariables, options?: C): Promise<Types.GetAccountQuery> {
      return requester<Types.GetAccountQuery, Types.GetAccountQueryVariables>(GetAccountDocument, variables, options) as Promise<Types.GetAccountQuery>;
    },
    GetAccountByEmail(variables: Types.GetAccountByEmailQueryVariables, options?: C): Promise<Types.GetAccountByEmailQuery> {
      return requester<Types.GetAccountByEmailQuery, Types.GetAccountByEmailQueryVariables>(GetAccountByEmailDocument, variables, options) as Promise<Types.GetAccountByEmailQuery>;
    },
    GetEvent(variables: Types.GetEventQueryVariables, options?: C): Promise<Types.GetEventQuery> {
      return requester<Types.GetEventQuery, Types.GetEventQueryVariables>(GetEventDocument, variables, options) as Promise<Types.GetEventQuery>;
    },
    GetEventPasses(variables: Types.GetEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassesQuery> {
      return requester<Types.GetEventPassesQuery, Types.GetEventPassesQueryVariables>(GetEventPassesDocument, variables, options) as Promise<Types.GetEventPassesQuery>;
    },
    GetOrganizer(variables: Types.GetOrganizerQueryVariables, options?: C): Promise<Types.GetOrganizerQuery> {
      return requester<Types.GetOrganizerQuery, Types.GetOrganizerQueryVariables>(GetOrganizerDocument, variables, options) as Promise<Types.GetOrganizerQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const adminSdk = getSdk(fetchData({admin:true}));