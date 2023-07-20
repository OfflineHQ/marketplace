import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

// Create a client specifically for testing
const queryClientForTest = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => null, // Turn off network error logging
  },
});

// A wrapper component that provides the QueryClient to your components
const QueryClientProviderForTest: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClientForTest}>
    {children}
  </QueryClientProvider>
);

const JwtTestContext = createContext<string | undefined>(undefined);

const useTestJwt = () => useContext(JwtTestContext);

export { QueryClientProviderForTest, JwtTestContext, useTestJwt };
