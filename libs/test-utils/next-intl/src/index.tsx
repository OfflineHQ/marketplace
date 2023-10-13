import { messages } from '@next/i18n';
import {
  RenderOptions,
  RenderResult,
  render as rtlRender,
} from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'queries'> {
  locale?: string;
}

interface CustomReactElement extends React.ReactElement {
  messages?: any;
}

export function renderWithIntl(
  ui: CustomReactElement,
  { locale = 'en', ...renderOptions }: RenderWithProvidersOptions = {},
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
