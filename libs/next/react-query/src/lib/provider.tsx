'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import * as React from 'react';

interface ReactQueryProvidersProps {
  children: React.ReactNode;
  devTools?: boolean;
}

export function ReactQueryProviders({
  devTools = false,
  ...props
}: ReactQueryProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      {devTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
