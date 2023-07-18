import * as Types from '@gql/user/types';

import { fetchData } from "@next/hasura/fetcher";
export const AccountFieldsFragmentDoc = `
    fragment AccountFields on account {
  id
  email
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
      eventPassPricing {
        priceAmount
        priceCurrency
      }
    }
  }
}
    `;
 const GetEventPassOrderForEventPassesDocument = `
    query GetEventPassOrderForEventPasses($eventPassIds: [String!]) {
  eventPassOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    id
    eventPassId
    quantity
    status
    created_at
    updated_at
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
 const DeleteEventPassOrderDocument = `
    mutation DeleteEventPassOrder($eventPassOrderId: uuid!) {
  delete_eventPassPendingOrder_by_pk(id: $eventPassOrderId) {
    id
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
    GetEventPassOrderForEventPasses(variables?: Types.GetEventPassOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassOrderForEventPassesQuery> {
      return requester<Types.GetEventPassOrderForEventPassesQuery, Types.GetEventPassOrderForEventPassesQueryVariables>(GetEventPassOrderForEventPassesDocument, variables, options) as Promise<Types.GetEventPassOrderForEventPassesQuery>;
    },
    InsertEventPassPendingOrders(variables: Types.InsertEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.InsertEventPassPendingOrdersMutation> {
      return requester<Types.InsertEventPassPendingOrdersMutation, Types.InsertEventPassPendingOrdersMutationVariables>(InsertEventPassPendingOrdersDocument, variables, options) as Promise<Types.InsertEventPassPendingOrdersMutation>;
    },
    DeleteEventPassOrder(variables: Types.DeleteEventPassOrderMutationVariables, options?: C): Promise<Types.DeleteEventPassOrderMutation> {
      return requester<Types.DeleteEventPassOrderMutation, Types.DeleteEventPassOrderMutationVariables>(DeleteEventPassOrderDocument, variables, options) as Promise<Types.DeleteEventPassOrderMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const userSdk = getSdk(fetchData());