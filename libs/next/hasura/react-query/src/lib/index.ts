'use client';

import { getHasuraEndpoint } from '@shared/client';

// Used to convert BigInt to string when sending to Hasura to avoid JSON parse error
interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => string;
}
// @ts-ignore: Unreachable code error
// eslint-disable-next-line @typescript-eslint/no-redeclare
BigInt.prototype.toJSON = function () {
  return this.toString();
};

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
    const url = getHasuraEndpoint();
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
