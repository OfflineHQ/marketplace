import * as Types from '@gql/user/types';

import { fetchData } from "@next/hasura/api";
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
export const EventPassNftFieldsFragmentDoc = `
    fragment EventPassNftFields on eventPassNft {
  id
  tokenId
  eventId
  eventPassId
  organizerId
  isRevealed
  currentOwnerAddress
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
 const DeleteEventPassPendingOrdersDocument = `
    mutation DeleteEventPassPendingOrders($eventPassIds: [String!]!) {
  delete_eventPassPendingOrder(where: {eventPassId: {_in: $eventPassIds}}) {
    affected_rows
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
 const GetEventPassPendingOrdersDocument = `
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
 const GetEventPassNftByIdDocument = `
    query GetEventPassNftById($id: uuid!, $locale: Locale!, $stage: Stage!) @cached {
  eventPassNft_by_pk(id: $id) {
    ...EventPassNftFields
    eventPass(locales: [$locale, en], stage: $stage) {
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
        title
        slug
        heroImage {
          url
        }
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
          slug
          name
          image {
            url
          }
        }
      }
    }
  }
}
    ${EventPassNftFieldsFragmentDoc}
${EventDateLocationsFieldsFragmentDoc}`;
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
    InsertEventPassPendingOrders(variables: Types.InsertEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.InsertEventPassPendingOrdersMutation> {
      return requester<Types.InsertEventPassPendingOrdersMutation, Types.InsertEventPassPendingOrdersMutationVariables>(InsertEventPassPendingOrdersDocument, variables, options) as Promise<Types.InsertEventPassPendingOrdersMutation>;
    },
    DeleteEventPassPendingOrder(variables: Types.DeleteEventPassPendingOrderMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrderMutation> {
      return requester<Types.DeleteEventPassPendingOrderMutation, Types.DeleteEventPassPendingOrderMutationVariables>(DeleteEventPassPendingOrderDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrderMutation>;
    },
    DeleteEventPassPendingOrders(variables: Types.DeleteEventPassPendingOrdersMutationVariables, options?: C): Promise<Types.DeleteEventPassPendingOrdersMutation> {
      return requester<Types.DeleteEventPassPendingOrdersMutation, Types.DeleteEventPassPendingOrdersMutationVariables>(DeleteEventPassPendingOrdersDocument, variables, options) as Promise<Types.DeleteEventPassPendingOrdersMutation>;
    },
    GetEventPassPendingOrderForEventPasses(variables?: Types.GetEventPassPendingOrderForEventPassesQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrderForEventPassesQuery> {
      return requester<Types.GetEventPassPendingOrderForEventPassesQuery, Types.GetEventPassPendingOrderForEventPassesQueryVariables>(GetEventPassPendingOrderForEventPassesDocument, variables, options) as Promise<Types.GetEventPassPendingOrderForEventPassesQuery>;
    },
    GetEventPassPendingOrders(variables: Types.GetEventPassPendingOrdersQueryVariables, options?: C): Promise<Types.GetEventPassPendingOrdersQuery> {
      return requester<Types.GetEventPassPendingOrdersQuery, Types.GetEventPassPendingOrdersQueryVariables>(GetEventPassPendingOrdersDocument, variables, options) as Promise<Types.GetEventPassPendingOrdersQuery>;
    },
    GetEventPassNftById(variables: Types.GetEventPassNftByIdQueryVariables, options?: C): Promise<Types.GetEventPassNftByIdQuery> {
      return requester<Types.GetEventPassNftByIdQuery, Types.GetEventPassNftByIdQueryVariables>(GetEventPassNftByIdDocument, variables, options) as Promise<Types.GetEventPassNftByIdQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export const userSdk = getSdk(fetchData());