import * as Types from '@gql/anonymous/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchDataReactQuery } from '@next/hasura/react-query';
export const PassAmountFieldsFragmentDoc = `
    fragment PassAmountFields on passAmount {
  maxAmount
  maxAmountPerUser
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
      options?: UseQueryOptions<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>
    ) =>
    useQuery<Types.GetEventPassNftByTokenReferenceQuery, TError, TData>(
      ['GetEventPassNftByTokenReference', variables],
      fetchDataReactQuery<Types.GetEventPassNftByTokenReferenceQuery, Types.GetEventPassNftByTokenReferenceQueryVariables>(GetEventPassNftByTokenReferenceDocument, variables),
      options
    );