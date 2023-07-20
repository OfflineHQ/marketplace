'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isServerSide, isDev } from '@utils';
// import { logger } from '@logger';

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
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || 'Error';
      throw new Error(message);
    }

    return json.data;
  };
};

let latestData = null;

const headers = { 'Content-Type': 'application/json' };

// https://tkdodo.eu/blog/using-web-sockets-with-react-query#consuming-data
// https://github.com/TanStack/query/issues/171#issuecomment-649810136

export const useReactQuerySubscription = async (
  query: string,
  operationName?: string,
  variables?: any
) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isServerSide()) return () => null;
    const ws_url = endpointUrl().replace(
      isDev() ? 'http' : 'https',
      isDev() ? 'ws' : 'wss'
    );
    const ws = new WebSocket(ws_url, 'graphql-ws');
    const init_msg = {
      type: 'connection_init',
      payload: { headers },
    };
    ws.onopen = function (event) {
      ws.send(JSON.stringify(init_msg));
      const msg = {
        id: '1',
        type: 'start',
        payload: { variables, extensions: {}, operationName, query },
      };
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = function (event) {
      const finalData = JSON.parse(event.data);
      if (finalData.type === 'data') {
        console.log('event: ', event);
        latestData = finalData.payload.data;
        let queryKey: string[] = [''];
        if (operationName)
          queryKey = variables ? [operationName, variables] : [operationName];
        else queryKey = variables ? [query, variables] : [query];
        queryClient.setQueriesData(queryKey, latestData);
        return latestData;
      }
    };
    return () => {
      // // Unsubscribe before exit
      // ws.send(JSON.stringify({ id: '1', type: 'stop' }));
      ws.close();
    };
  }, [query, variables]);
};
