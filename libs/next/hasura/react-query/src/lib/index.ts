'use client';

import { endpointUrl } from '@next/hasura/shared';

declare global {
  interface Window {
    jwtTestToken?: string;
  }
}

// This fetcher is used for fetching data for react query from Hasura GraphQL API on the client side.
export const fetchDataReactQuery = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options: { headers?: RequestInit['headers'] } = {}
): (() => Promise<TData>) => {
  return async () => {
    const jwtTestToken = window?.jwtTestToken || null;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: jwtTestToken ? `Bearer ${jwtTestToken}` : '',
      ...(options.headers ?? {}),
    };
    const url = endpointUrl();
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: headers as HeadersInit,
      body: JSON.stringify({
        query,
        variables,
      }),
      // we use react query cache, so we don't need to keep cache in nextjs
      cache: 'no-store',
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || 'Error';
      throw new Error(message);
    }

    return json.data;
  };
};
