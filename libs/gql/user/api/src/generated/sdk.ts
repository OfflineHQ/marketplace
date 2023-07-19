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
 const DeleteEventPassPendingOrderDocument = `
    mutation DeleteEventPassPendingOrder($eventPassPendingOrderId: uuid!) {
  delete_eventPassPendingOrder_by_pk(id: $eventPassPendingOrderId) {
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
    GetEventPassPendingOrderForEventPasses(variables?: Types.GetEventPassPendingOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrderForEventPassesQuery> {
      return requester<Types.GetEventPassPendingOrderForEventPassesQuery, Types.GetEventPassPendingOrderForEventPassesQueryVariables>(GetEventPassPendingOrderForEventPassesDocument, variables, options) as Promise<Types.GetEventPassPendingOrderForEventPassesQuery>;
    },
    InsertEventPassPendingOrders(variables: Types.InsertEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.InsertEventPassPendingOrdersMutation> {
      return requester<Types.InsertEventPassPendingOrdersMutation, Types.InsertEventPassPendingOrdersMutationVariables>(InsertEventPassPendingOrdersDocument, variables, options) as Promise<Types.InsertEventPassPendingOrdersMutation>;
    },
    DeleteEventPassPendingOrder(variables: Types.DeleteEventPassPendingOrderMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrderMutation> {
      return requester<Types.DeleteEventPassPendingOrderMutation, Types.DeleteEventPassPendingOrderMutationVariables>(DeleteEventPassPendingOrderDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrderMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const userSdk = getSdk(fetchData());