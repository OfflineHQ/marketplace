import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { messages } from '@next/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
interface RenderWithProvidersOptions extends Omit<RenderOptions, 'queries'> {
  locale?: string;
}

interface CustomReactElement extends React.ReactElement {
  messages?: any;
}

function renderWithIntl(
  ui: CustomReactElement,
  { locale = 'en', ...renderOptions }: RenderWithProvidersOptions = {}
): RenderResult {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    // mocked date to always get the same result in tests
    const staticDate = new Date('2023-06-05T00:00:00Z');
    return (
      <NextIntlClientProvider
        locale={locale}
        messages={messages.en}
        now={staticDate}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

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

export { renderWithIntl, QueryClientProviderForTest };
